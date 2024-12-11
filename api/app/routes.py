from flask import jsonify, request, send_file, render_template, make_response
from app import app, db, bcrypt, mail
from app.models import User, Role, Pet, PetPhotos, RequestService, Application, PetsInService, Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import base64
from flask_cors import CORS
from sqlalchemy import func
from weasyprint import HTML
from flask_mail import Message

CORS(app, resources={r"/*": {"origins": "*"}})
from datetime import datetime

DATE_FORMAT = '%d/%m/%Y'

@app.route('/')
def index():
    return "Welcome to PetConnecting!"

# --- User Endpoints ---

@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = request.args.get('id', type=int)  
    name_filter = request.args.get('name')  
    query = User.query.filter(User.RoleID == 'basic')  

    if user_id is not None:  
        query = query.filter(User.ID == user_id)  
    if name_filter:  
        query = query.filter(User.Name.ilike(f'%{name_filter}%'))  

    users = query.all()  
    if users:
        response = []
        for user in users:
            if user.ProfilePhoto:
                profile_image_base64 = base64.b64encode(user.ProfilePhoto).decode('utf-8')
            else:
                profile_image_base64 = None

            response.append({
                'id': user.ID,
                'name': user.Name,
                'email': user.Email,
                'profile_image_base64': profile_image_base64,
                'image_mimetype': user.MimeType,
                'rating' : user.TotalRating / user.RatingCount if user.RatingCount > 0 else 0
            })

        return jsonify(response)
    
    return jsonify({'error': 'No users found'}), 404


@app.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def edit_user(user_id):
    data = request.get_json()

    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404

    email = data.get('email', user.Email)
    password = data.get('password', None)
    name = data.get("name", user.Name)
    surname = data.get("surname", user.Surname)
    roleID = data.get("role_id", user.RoleID)
    points = data.get('points', user.Points)

    existing_user = User.query.filter_by(Email=email).first()
    if existing_user and existing_user.ID != user_id:
        return jsonify({"msg": "Email already in use"}), 400

    user.Email = email
    if password:
        user.Password = bcrypt.generate_password_hash(password).decode('utf-8')
    user.Name = name
    user.Surname = surname
    user.RoleID = roleID
    user.Points = points

    db.session.commit()

    return jsonify({
        'id': user.ID,
        'name': user.Name,
        'email': user.Email
    }), 200

# --- Registration & Login Endpoints ---

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data['email']
    password = data['password']
    name = data["name"]
    surname = data["surname"]

    if not name or not surname or not email or not password:
        return jsonify({"msg": "Missing data"}), 400
    
    if User.query.filter_by(Email=email).first():
        return jsonify({"msg": "User already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        Email=email,
        Password=hashed_password,
        Name=name,
        Surname=surname,
        RoleID='basic',
        ProfilePhoto=None,
        TotalRating=0,
        RatingCount=0
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'id': new_user.ID,
        'name': new_user.Name,
        'email': new_user.Email
    }), 201

@app.route('/register_vet', methods=['POST'])
@jwt_required()
def register_vet():
    current_user_id = get_jwt_identity()
    print(User.query.get(current_user_id).RoleID)
    if not User.query.get(current_user_id).RoleID == 'admin':
        return jsonify({"msg": "You are not authorized to register a vet"}), 403,

    data = request.get_json()

    email = data['email']
    password = data['password']
    name = data["name"]
    surname = data["surname"]

    if not name or not surname or not email or not password:
        return jsonify({"msg": "Missing data"}), 400
    
    if User.query.filter_by(Email=email).first():
        return jsonify({"msg": "User already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        Email=email,
        Password=hashed_password,
        Name=name,
        Surname=surname,
        RoleID='vet',
        ProfilePhoto=None,
        TotalRating=0,
        RatingCount=0
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'id': new_user.ID,
        'name': new_user.Name,
        'email': new_user.Email
    }), 201


@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data['email']
    password = data['password']

    user = User.query.filter_by(Email=email).first()
    if not user:
        return jsonify({"msg": "Invalid username"}), 401
    
    if (user.RoleID == 'admin' and user.Password == password) or bcrypt.check_password_hash(user.Password, password):
        access_token = create_access_token(identity=user.ID)
        return jsonify(access_token=access_token, user_id=user.ID, role=user.RoleID), 200
    
    return jsonify({"msg": "Invalid username or password"}), 401


# --- Role Endpoints ---

@app.route('/user/<int:user_id>/role', methods=['GET'])
@jwt_required()
def get_user_role(user_id):
    current_user_id = get_jwt_identity()
    role = User.query.get(user_id).RoleID

    if not role:
        return jsonify({'error': 'Role not found'}), 404
    
    return jsonify({'role': role}), 200

@app.route('/upgrade_premium', methods=['PUT'])
@jwt_required()
def upgrade_user_premium():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user.RoleID == 'premium':
        return jsonify({"msg": "User is already premium"}), 400

    user.RoleID = 'premium'
    db.session.commit()

    return jsonify({"msg": "User upgraded to premium successfully"}), 200

@app.route('/downgrade_basic', methods=['PUT'])
@jwt_required()
def downgrade_user_basic():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user.RoleID == 'basic':
        return jsonify({"msg": "User is already basic"}), 400

    user.RoleID = 'basic'
    db.session.commit()

    return jsonify({"msg": "User downgraded to basic successfully"}), 200

@app.route('/roles', methods=['GET'])
@jwt_required()
def get_roles():
    role_id = request.args.get('id', type=int) 
    query = Role.query

    if role_id is not None:  
        query = query.filter(Role.RoleID == role_id)  

    roles = query.all()  
    if roles:
        return jsonify([{
            'id': role.RoleID,
        } for role in roles])
    
    return jsonify({'error': 'No roles found'}), 404

# --- Pet Endpoints ---

@app.route('/pets', methods=['GET'])
@jwt_required()
def get_pets():
    pet_id = request.args.get('id', type=int)  
    name_filter = request.args.get('name') 
    user_id = request.args.get('user_id', type=int)
    query = Pet.query  

    if pet_id is not None:  
        query = query.filter(Pet.ID == pet_id) 
    if name_filter:  
        query = query.filter(Pet.Name.ilike(f'%{name_filter}%'))
    if user_id is not None:  
        query = query.filter(Pet.UserID == user_id)   

    pets = query.all()  

    pets_list = [pet.to_dict() for pet in pets]
    return jsonify(pets_list)
    
@app.route('/pets', methods=['POST'])
@jwt_required()
def create_pet():
    current_user_id = get_jwt_identity()
    
    data = request.get_json()
    new_pet = Pet(
        UserID=current_user_id,
        Name=data['name'],
        AnimalType=data['animal_type'],
        Breed=data.get('breed', ''),
        Description=data.get('description', ''),
        Allergies=data.get('allergies', ''),
        Weight=data.get('weight', 0.0),
        Size=data['size'],
        Age=data.get('age', 0)
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({
        'id': new_pet.ID,
        'name': new_pet.Name,
        'animal_type': new_pet.AnimalType
    }), 201

@app.route('/pets/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    current_user_id = get_jwt_identity()

    # Obtener los datos de la solicitud
    data = request.get_json()

    # Buscar la mascota por ID
    pet = Pet.query.filter_by(ID=pet_id, UserID=current_user_id).first()

    if not pet:
        return jsonify({"msg": "Pet not found or you do not have permission to update this pet"}), 404

    # Actualizar los datos de la mascota solo si están presentes en el request
    pet.Name = data.get('name', pet.Name)
    pet.AnimalType = data.get('animal_type', pet.AnimalType)
    pet.Breed = data.get('breed', pet.Breed)
    pet.Description = data.get('description', pet.Description)
    pet.Allergies = data.get('allergies', pet.Allergies)
    pet.Weight = data.get('weight', pet.Weight)
    pet.Size = data.get('size', pet.Size)
    pet.Age = data.get('age', pet.Age)

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({
        'id': pet.ID,
        'name': pet.Name,
        'animal_type': pet.AnimalType,
        'breed': pet.Breed,
        'description': pet.Description,
        'allergies': pet.Allergies,
        'weight': pet.Weight,
        'size': pet.Size,
        'age': pet.Age
    }), 200

@app.route('/pets/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    current_user_id = get_jwt_identity()  # Obtener el ID del usuario autenticado

    # Buscar la mascota en la base de datos
    pet = Pet.query.filter_by(ID=pet_id, UserID=current_user_id).first()

    if not pet:
        return jsonify({'error': 'Pet not found or you are not authorized to delete this pet'}), 404

    pet_photos = PetPhotos.query.filter_by(PetID=pet_id).all()
    for pet_photo in pet_photos:
        db.session.delete(pet_photo)
    db.session.commit()
    # Eliminar la mascota
    db.session.delete(pet)
    db.session.commit()

    return jsonify({'message': f'Pet successfully deleted'}), 200

@app.route('/pets/<int:pet_id>/photos', methods=['GET'])
@jwt_required()
def get_pet_photos(pet_id):

    pet = Pet.query.filter_by(ID=pet_id).first()

    if not pet:
        return jsonify({"msg": "Pet not found or you do not have permission to view this pet's photos"}), 404

    photos = PetPhotos.query.filter_by(PetID=pet_id).all()

    photo_list = [photo.to_dict() for photo in photos]
    return jsonify(photo_list)

# --- Photos Endpoints ---

@app.route('/user/<int:user_id>/profile_photo', methods=['PUT'])
@jwt_required()
def add_user_photo(user_id):

    current_user_id = get_jwt_identity()

    if current_user_id != user_id:
        return jsonify({'error': 'You are not authorized to edit this users photo'}), 404 

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']  # Obtiene el archivo

    if file.filename == '':  # Verifica que no esté vacío
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        mime_type = file.mimetype  # Obtiene el MIME type del archivo

        # Lee el contenido del archivo como binario
        image_data = file.read()

        user = User.query.filter_by(ID=user_id).first() 
        user.ProfilePhoto = image_data
        user.MimeType = mime_type
        db.session.commit()

        return jsonify({'message': 'Image uploaded successfully'}), 200

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/pets/<int:pet_id>/photos', methods=['POST'])
@jwt_required()
def add_pet_photo(pet_id):

    current_user_id = get_jwt_identity()

    # Buscar la mascota por ID
    pet = Pet.query.filter_by(ID=pet_id, UserID=current_user_id).first()

    if not pet:
        return jsonify({"msg": "Pet not found or you do not have permission to update this pet"}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']  # Obtiene el archivo

    if file.filename == '':  # Verifica que no esté vacío
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        mime_type = file.mimetype  # Obtiene el MIME type del archivo
        # Lee el contenido del archivo como binario
        image_data = file.read()

        new_photo = PetPhotos(
            PetID=pet.ID,
            Photo=image_data,
            MimeType=mime_type
        )
        db.session.add(new_photo)
        
        db.session.commit()

        return jsonify({'message': 'Image uploaded successfully'}), 200

    return jsonify({'error': 'Invalid file type'}), 400
    
@app.route('/pets/<int:pet_id>/photos/<int:photo_id>', methods=['DELETE']) 
@jwt_required()
def delete_pet_photo(pet_id, photo_id):
    current_user_id = get_jwt_identity()

    pet = Pet.query.filter_by(ID=pet_id, UserID=current_user_id).first()

    if not pet:
        return jsonify({'error': 'Pet not found or you are not authorized to delete this pet photo'}), 404

    photo = PetPhotos.query.filter_by(ID=photo_id, PetID=pet_id).first()

    if not photo:
        return jsonify({'error': 'Photo not found'}), 404

    db.session.delete(photo)
    db.session.commit()

    return jsonify({'message': 'Photo deleted successfully'}), 200

# --- Service Endpoints ---
@app.route('/services', methods=['GET'])
@jwt_required()
def get_services():
    publisher_id = request.args.get("PublisherId")
    publish_date = request.args.get("publishDate")
    min_date = request.args.get("min_date")
    max_date = request.args.get("max_date")
    address = request.args.get("address")
    min_cost = request.args.get("min_cost")
    max_cost = request.args.get("max_cost")
    completed = request.args.get("completed")
    pet_id = request.args.get("petId")
    taker_id = request.args.get("takerId")

    animal_type = request.args.get("animal_type")

    query = RequestService.query

    if publisher_id is not None:
        query = query.filter(RequestService.PublisherId == publisher_id)

    if publish_date is not None:
        query = query.filter(RequestService.publishDate == publish_date)

    if  taker_id is not None:
        query = query.filter(RequestService.takerId == taker_id)
        query = query.filter(RequestService.serviceDateIni >= datetime.strptime(min_date, DATE_FORMAT))
    
    if min_date is not None:
        query = query.filter(RequestService.serviceDateIni >= datetime.strptime(min_date, DATE_FORMAT))
        query = query.filter(RequestService.serviceDateEnd <= datetime.strptime(max_date, DATE_FORMAT))
    
    if max_date is not None:
        query = query.filter(RequestService.serviceDateEnd <= datetime.strptime(max_date, DATE_FORMAT))

    if address is not None:
        query = query.filter(RequestService.address == address)
    
    if min_cost is not None:
        query = query.filter(RequestService.cost >= min_cost)

    if max_cost is not None:
        query = query.filter(RequestService.cost <= max_cost)

    if completed is not None:
        query = query.filter(RequestService.completed == completed)
    
    if pet_id is not None:
        query = query.filter(RequestService.petId == pet_id)

    if pet_id is not None:
        query = query.join(PetsInService, PetsInService.ServiceId == RequestService.ServiceId).filter(PetsInService.PetId == pet_id)

    if animal_type is not None:
        query = query.join(PetsInService, PetsInService.ServiceId == RequestService.ServiceId).join(Pet, Pet.ID == PetsInService.PetId).filter(func.lower(Pet.AnimalType)==str(animal_type).lower())

    services = query.all()
    services_list = [service.to_dict() for service in services]

    for service in services_list:
        pets_in_service = PetsInService.query.filter_by(ServiceId=service['ServiceId']).all()
        pets_list = []
        photos_list = []
        for pet_in_service in pets_in_service:
            pet = Pet.query.get(pet_in_service.PetId)
            pets_list.append(pet.Name)

            pet_photo = PetPhotos.query.filter_by(PetID=pet.ID).first()
            if pet_photo:
                photos_list.append(pet_photo.to_dict())

        publisher = User.query.get(service['PublisherId'])
        service['publisher'] = publisher.Name + ' ' + publisher.Surname

        service['pets'] = pets_list
        service['photos'] = photos_list

    return jsonify(services_list)

@app.route('/service', methods=['POST'])
@jwt_required()
def post_service():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    service_date_ini = data.get("serviceDateIni")
    service_date_fin = data.get("serviceDateFin")
    address = data.get("address")
    cost = data.get("cost")
    description = data.get("description")

    pets = data.get("pets")
    
    for pet_id in pets:
        pet = Pet.query.get(pet_id)
        if not pet:
            return jsonify({"msg": "Pet not found"}), 404
        if(pet.UserID != current_user_id):
            return jsonify({"msg": "The pet doesn't belong to the authenticated user"}), 404

    if not pets or not description or not service_date_ini or not service_date_fin or not address or not cost or not pet_id:
        return jsonify({"msg": "Missing data"}), 400
    
    """is_valid, val = utils.verify_address(address)
    if not is_valid:
        return jsonify({"msg": val}), 400"""

    new_service = RequestService(
        PublisherId = current_user_id,
        publishDate = datetime.now(),
        description = description,
        serviceDateIni = datetime.strptime(service_date_ini, DATE_FORMAT),
        serviceDateEnd = datetime.strptime(service_date_fin, DATE_FORMAT),
        address = address,
        cost = cost,
        completed = False
    )

    db.session.add(new_service)
    db.session.commit()
    for pet_id in pets:
        new_pets_in_service = PetsInService(
            PetId = pet_id,
            ServiceId = new_service.ServiceId,
            UserId = current_user_id
        )
        db.session.add(new_pets_in_service)

    db.session.commit()
    return jsonify({
        'id': new_service.ServiceId
    }), 201

@app.route('/service/<int:service_id>', methods=['PUT'])
@jwt_required()
def edit_service(service_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to edit this service"}), 403

    description = data.get("description", "")
    service_date_ini = data.get("serviceDateIni")
    service_date_fin = data.get("serviceDateFin")
    address = data.get("address")
    cost = data.get("cost")
    pets = data.get("pets")

    if pets:
        pets_in_service = PetsInService.query.filter_by(ServiceId=service_id).all()
        for pet_in_service in pets_in_service:
            db.session.delete(pet_in_service)
        for pet_id in pets:
            pet = Pet.query.get(pet_id)
            if not pet:
                return jsonify({"msg": "Pet not found"}), 404
            if pet.UserID != current_user_id:
                return jsonify({"msg": "The pet doesn't belong to the authenticated user"}), 403
            new_pets_in_service = PetsInService(
                PetId = pet_id,
                ServiceId = service_id,
                UserId = current_user_id
            )
            db.session.add(new_pets_in_service)
    
    if not description or not service_date_ini or not service_date_fin or not address or not cost or not pet_id:
        return jsonify({"msg": "Missing data"}), 400
    service.serviceDateIni = datetime.strptime(service_date_ini, DATE_FORMAT)
    service.serviceDateEnd = datetime.strptime(service_date_fin, DATE_FORMAT)
    service.serviceDateIni = datetime.strptime(service_date_ini, DATE_FORMAT)
    service.serviceDateEnd = datetime.strptime(service_date_fin, DATE_FORMAT)
    service.address = address
    service.cost = cost
    service.petId = pet_id

    db.session.commit()

    return jsonify({"msg": "Service updated successfully"}), 200

@app.route('/service/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    current_user_id = get_jwt_identity()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to delete this service"}), 403

    for pet_in_service in PetsInService.query.filter_by(ServiceId=service_id).all():
        db.session.delete(pet_in_service)

    db.session.delete(service)

    pets_in_service = PetsInService.query.filter_by(ServiceId=service_id).all()
    for pet_in_service in pets_in_service:
        db.session.delete(pet_in_service)

    db.session.commit()

    return jsonify({"msg": "Service deleted successfully"}), 200

@app.route('/service/<int:service_id>/assign', methods=['PUT'])
@jwt_required()
def assign_service(service_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    taker_id = data.get("taker_id")

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404
    
    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to assign this service"}), 403
    
    if not taker_id:
        return jsonify({"msg": "Missing data"}), 400

    if not User.query.get(taker_id):
        return jsonify({"msg": "User to be assigned not found"}), 404

    if  Application.query.filter_by(ServiceId=service_id, Accepted=True).first():
        return jsonify({"msg": "Service already assigned"}), 400

    application = Application.query.filter_by(ServiceId=service_id, UserId=taker_id).first()
    if not application:
        return jsonify({"msg": "User has not applied for this service"}), 400


    application.Accepted = True
    
    db.session.commit()

    return jsonify({"msg": "Service assigned successfully"}), 200

@app.route('/service/<int:service_id>/unassign', methods=['PUT'])
@jwt_required()
def unassign_service(service_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    taker_id = data.get("taker_id")

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404
    
    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to unassign this service"}), 403
    
    if not taker_id:
        return jsonify({"msg": "Missing data"}), 400

    if not User.query.get(taker_id):
        return jsonify({"msg": "User to be unassigned not found"}), 404
    
    application = Application.query.filter_by(ServiceId=service_id, UserId=taker_id).first()
    if not application:
        return jsonify({"msg": "User has not applied for this service"}), 400
    
    application.Accepted = False
    
    db.session.commit()

    return jsonify({"msg": "Service unassigned successfully"}), 200

@app.route('/service/<int:service_id>/complete', methods=['PUT']) 
@jwt_required()
def complete_service(service_id):
    current_user_id = get_jwt_identity()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to complete this service"}), 403

    application = Application.query.filter_by(ServiceId=service_id, Accepted=True).first()
    if not application:
        return jsonify({"msg": "Service not assigned yet"}),

    if application.Signed == False:
        return jsonify({"msg": "Service not signed yet"}), 400

    service.completed = True
    db.session.commit()

    return jsonify({"msg": "Service completed successfully"}), 200

@app.route('/service/<int:service_id>/rate', methods=['PUT'])
@jwt_required()
def rate_service(service_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    rating = data.get("rating")

    if not rating:  
        return jsonify({"msg": "Missing data"}), 400

    service = RequestService.query.get(service_id)
    
    if not service:
        return jsonify({"msg": "Service not found"}), 404
    if service.completed == False:
        return jsonify({"msg": "Service not completed yet"}), 400
    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to rate this service"}), 403
    if service.rated == True:
        return jsonify({"msg": "Service already rated"}), 400
    
    application = Application.query.filter_by(ServiceId=service_id, Accepted=True).first() 
    appliant = User.query.get(application.UserId)
    appliant.RatingCount = appliant.RatingCount + 1
    appliant.TotalRating = float(appliant.TotalRating) + float(rating)
    
    service.appliantRated = True

    db.session.commit()

    return jsonify({"msg": "Service rated successfully"}), 200

@app.route('/service/<int:service_id>/rate_pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def rate_pet(service_id, pet_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    rating = data.get("rating")

    if not rating:  
        return jsonify({"msg": "Missing data"}), 400
    
    application = Application.query.filter_by(ServiceId=service_id, Accepted=True).first()

    if application.UserId != current_user_id:
        return jsonify({"msg": "You are not authorized to rate pets in this service"}), 403
    
    pet = Pet.query.get(pet_id)
    pets_in_service = PetsInService.query.filter_by(ServiceId=service_id).all()

    pet_ids_in_service = [pet_in_service.PetId for pet_in_service in pets_in_service]
    if pet_id not in pet_ids_in_service:
        return jsonify({"msg": "Pet not found in this service"}), 404
    
    pet.TotalRating = float(pet.TotalRating) + float(rating)
    pet.RatingCount = pet.RatingCount + 1

    pet_in_service = PetsInService.query.filter_by(ServiceId=service_id, PetId=pet_id).first()
    pet_in_service.Rated = True

    db.session.commit()

    return jsonify({"msg": "Pet rated successfully"}), 200
    

   

# --- Application Endpoints ---
@app.route('/service/<int:service_id>/apply', methods=['PUT'])
@jwt_required()
def apply_for_service(service_id):
    current_user_id = get_jwt_identity()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    if service.PublisherId == current_user_id:
        return jsonify({"msg": "You cannot take your own service"}), 400

    applications = Application.query.filter_by(ServiceId=service_id).all()
    for application in applications:
        if application.UserId == current_user_id:
            return jsonify({"msg": "You have already applied for this service"}), 400
        if application.Accepted:
            return jsonify({"msg": "Service already taken"}), 400

    application = Application(
        ServiceId = service_id,
        UserId = current_user_id
    )
    db.session.add(application)    
    db.session.commit()

    return jsonify({"msg": "Service taken successfully"}), 200

@app.route('/service/<int:service_id>/applications', methods=['GET'])
@jwt_required()
def get_applications(service_id):
    current_user_id = get_jwt_identity()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    if service.PublisherId != current_user_id:
        return jsonify({"msg": "You are not authorized to view this service's applications"}), 403

    applications = Application.query.filter_by(ServiceId=service_id).all()

    application_list = [application.to_dict() for application in applications]
    return jsonify(application_list)

@app.route('/service/<int:service_id>/application/<int:application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(service_id, application_id):
    current_user_id = get_jwt_identity()

    service = RequestService.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404
    
    application = Application.query.filter_by(ApplicationId=application_id).first()

    if not application:
        return jsonify({"msg": "Application not found"}), 404

    if current_user_id != service.PublisherId and current_user_id != application.UserId:
        return jsonify({"msg": "You are not authorized to delete this application"}), 403

    db.session.delete(application)
    db.session.commit()

    return jsonify({"msg": "Application deleted successfully"}), 200

@app.route('/service/applications', methods=['GET'])
@jwt_required()
def get_all_applications():
    applications = Application.query.all()
    application_list = [application.to_dict() for application in applications]
    return jsonify(application_list)


@app.route('/service/<int:service_id>/application/<int:application_id>/sign', methods=['POST'])
@jwt_required()
def sign_application(service_id, application_id):

    service = RequestService.query.get(service_id)
    if not service:
        return jsonify({"msg": "Service not found"}), 404
    if service.completed:
        return jsonify({"msg": "Service already completed"}), 400
    if service.PublisherId != get_jwt_identity():
        return jsonify({"msg": "You are not authorized to sign this service"}), 403

    application = Application.query.filter_by(ApplicationId=application_id).first()

    if not application:
        return jsonify({"msg": "Application not found"}), 404
    
    if application.Accepted == False:
        return jsonify({"msg": "Application not accepted"}), 400
    
    if application.Signed:
        return jsonify({"msg": "Application already signed"}), 400

    if 'owner_signature' not in request.files or 'applier_signature' not in request.files:
        return jsonify({'error': 'Both owner_signature and applier_signature are required'}), 400

    owner_signature = request.files['owner_signature']
    applier_signature = request.files['applier_signature']

    if owner_signature.filename == '' or applier_signature.filename == '':
        return jsonify({'error': 'Both signatures must have filenames'}), 400

    owner_signature_base64 = base64.b64encode(owner_signature.read()).decode('utf-8')
    applier_signature_base64 = base64.b64encode(applier_signature.read()).decode('utf-8')
    current_user_id = get_jwt_identity()

    formatted_date = datetime.now().strftime("%d/%m/%Y")
    start_date = service.serviceDateIni.strftime("%d/%m/%Y")
    end_date = service.serviceDateEnd.strftime("%d/%m/%Y")

    owner_email = User.query.get(current_user_id).Email

    application.Signed = True
    caregiver_email = User.query.get(application.UserId).Email

    pets = PetsInService.query.filter_by(ServiceId=service_id).all()
    pets_list = []
    for pet in pets:
        pet = Pet.query.get(pet.PetId)
        pets_list.append(pet.to_dict())

    html_content = render_template(
        'legal.html', 
        current_date=formatted_date, 
        owner_email=owner_email, 
        caregiver_email=caregiver_email, 
        pets_list=pets_list, 
        start_date=start_date, 
        end_date=end_date,
        owner_signature_base64=owner_signature_base64,
        applier_signature_base64=applier_signature_base64)
    
    pdf = HTML(string=html_content).write_pdf()

    msg = Message(
        'Signed Pet Care Agreement',
        sender=app.config['MAIL_DEFAULT_SENDER'],
        recipients=[owner_email, caregiver_email],
        body="Here is the Pet Care Agreement you just signed.",
    )

    msg.attach(
        "Pet_Care_Agreement.pdf",  
        "application/pdf",         
        pdf                         
    )

    mail.send(msg)

    db.session.commit()

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=reporte.pdf'
    return response


# --- Chat Endpoints ---
@app.route('/user/<int:user_id>/chat', methods=['GET'])
@jwt_required()
def get_chat(user_id):
    current_user_id = get_jwt_identity()
    messages = Message.query.filter(((Message.sender_id == current_user_id) | (Message.sender_id == user_id)) &
                                    ((Message.receiver_id == current_user_id) | (Message.receiver_id == user_id)) ).all()
    message_list = [message.to_dict() for message in messages]
    return jsonify(message_list)

@app.route('/chat_overview', methods=['GET'])
@jwt_required()
def get_chat_overview():
    current_user_id = get_jwt_identity()
    subquery = db.session.query(
        Message.receiver_id,
        func.max(Message.timestamp).label('latest_message')
    ).filter(Message.sender_id == current_user_id).group_by(Message.receiver_id).subquery()

    messages = db.session.query(Message).join(
        subquery,
        (Message.receiver_id == subquery.c.receiver_id) & (Message.timestamp == subquery.c.latest_message)
    ).all()

    message_list = [message.to_dict() for message in messages]
    return jsonify(message_list)
    
@app.route('/test-email')
def test_email():
    msg = Message(
        "Prueba de correo",
        sender=app.config['MAIL_DEFAULT_SENDER'],
        recipients=["destinatario@ejemplo.com"],
        body="Este es un correo de prueba usando MailHog."
    )
    try:
        mail.send(msg)
        return "Correo enviado y capturado por MailHog"
    except Exception as e:
        return f"Error al enviar correo: {e}", 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)