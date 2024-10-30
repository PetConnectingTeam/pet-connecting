from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from flask import request
from . import socketio
from app import app, socketio
from app.models import db, Message

# User connects to the WebSocket
@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')
    if user_id:
        join_room(user_id)  # Join the user to a unique room based on their ID
        emit('status', {'msg': f'User {user_id} has connected'}, room=user_id)

# User sends a message to another user
@socketio.on('send_message')
def handle_send_message(data):
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')
    
    # Save the message to the database
    if sender_id and receiver_id and content:
        message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
        db.session.add(message)
        db.session.commit()

        # Emit message to the receiver's room
        emit('receive_message', {
            'sender_id': sender_id,
            'content': content,
            'timestamp': message.timestamp.isoformat()
        }, room=receiver_id)

# User disconnects from the WebSocket
@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.args.get('user_id')
    if user_id:
        leave_room(user_id)
        emit('status', {'msg': f'User {user_id} has disconnected'}, room=user_id)