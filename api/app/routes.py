from flask import jsonify, request # type: ignore
from app import app, db
from app.models import User, Role, Pet, Photos

@app.route('/')
def index():
    return "Flask API is running!"

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
        return jsonify([{
            'id': user.ID,
            'name': user.Name,
            'email': user.Email
        } for user in users])
    
    return jsonify({'error': 'No users found'}), 404


@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        Email=data['email'],
        Password=data['password'],
        Name=data['name'],
        Surname=data.get('surname', ''),
        RoleID=data.get('role_id'),
        Points=data.get('points', 0),
        ProfilePhoto=data.get('profile_photo'),
        Rating=data.get('rating', 0.0)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'id': new_user.ID,
        'name': new_user.Name,
        'email': new_user.Email
    }), 201

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
def create_pet():
    data = request.get_json()
    new_pet = Pet(
        UserID=data['user_id'],
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

# --- Photos Endpoints ---


@app.route('/photos', methods=['GET'])
def get_photos():
    photo_id = request.args.get('id', type=int)  
    query = Photos.query  

    if photo_id is not None:  
        query = query.filter(Photos.ID == photo_id)

    photos = query.all()  
    if photos:
        return jsonify([{
            'id': photo.ID,
            'pet_id': photo.PetID
        } for photo in photos])
    
    return jsonify({'error': 'No photos found'}), 404


@app.route('/photos', methods=['POST'])
def create_photo():
    data = request.get_json()
    new_photo = Photos(
        PetID=data['pet_id'],
        Photos=data['photos']  # Asumiendo que se proporciona como un binario
    )
    db.session.add(new_photo)
    db.session.commit()
    return jsonify({
        'id': new_photo.ID,
        'pet_id': new_photo.PetID
    }), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
