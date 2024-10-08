from flask import jsonify, request
from app import app, db, bcrypt
from app.models import User, Role, Pet, PetPhotos
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import base64

@app.route('/')
def index():
    return "Welcome to PetConnecting!"

# --- User Endpoints ---

@app.route('/users', methods=['GET'])
def get_users():
    user_id = request.args.get('id', type=int)  
    name_filter = request.args.get('name')  
    query = User.query  

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
                'image_mimetype': user.MimeType
            })

        return jsonify(response)
    
    return jsonify({'error': 'No users found'}), 404


@app.route('/user/<int:user_id>', methods=['PUT'])
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
    rating = data.get('rating', user.Rating)

    image_data = None
    file_mimetype = None
    if 'file' in request.files:
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not name or not surname or not email or not roleID:
            return jsonify({"msg": "Missing data"}), 400
        
        image_data = file.read()
        file_mimetype = file.mimetype

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
    user.Rating = rating
    if image_data:
        user.ProfilePhoto = image_data
    if file_mimetype:
        user.MimeType = file_mimetype

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
        RoleID=1,
        Points=100,
        ProfilePhoto=None,
        Rating=None
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
    if user and bcrypt.check_password_hash(user.Password, password):
        access_token = create_access_token(identity=user.ID)
        return jsonify(access_token=access_token, user_id=user.ID), 200
    
    return jsonify({"msg": "Invalid username or password"}), 401


# --- Role Endpoints ---

@app.route('/roles', methods=['GET'])
def get_roles():
    role_id = request.args.get('id', type=int) 
    query = Role.query

    if role_id is not None:  
        query = query.filter(Role.ID == role_id)  

    roles = query.all()  
    if roles:
        return jsonify([{
            'id': role.ID,
            'rol_type': role.RolType,
            'description': role.Description
        } for role in roles])
    
    return jsonify({'error': 'No roles found'}), 404


@app.route('/roles', methods=['POST'])
def create_role():
    data = request.get_json()
    new_role = Role(
        RolType=data['rol_type'],
        Description=data['description']
    )
    db.session.add(new_role)
    db.session.commit()
    return jsonify({
        'id': new_role.ID,
        'rol_type': new_role.RolType,
        'description': new_role.Description
    }), 201

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
    if pets:
        return jsonify([{
            'id': pet.ID,
            'name': pet.Name,
            'animal_type': pet.AnimalType
        } for pet in pets])
    
    return jsonify({'error': 'No pets found'}), 404


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

    # Eliminar la mascota
    db.session.delete(pet)
    db.session.commit()

    return jsonify({'message': f'Pet with id {pet_id} has been deleted'}), 200


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
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
