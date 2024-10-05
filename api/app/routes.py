from flask import jsonify, request
from app import app, db
from app.models import User


@app.route('/')
def index():
    return "Flask API is running!"

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name, 'email': user.email} for user in users])

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id, 'name': new_user.name, 'email': new_user.email}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
