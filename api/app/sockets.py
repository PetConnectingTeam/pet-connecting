from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from flask import request
from . import socketio
from app import app, socketio
from app.models import db, Message, User
import logging
from app.routes import send_notification

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# User connects to the WebSocket
@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')
    if user_id:
        join_room(user_id)  # Join the user to a unique room based on their ID
        logger.info(f'User {user_id} has connected')
        emit('status', {'msg': f'User {user_id} has connected'}, room=user_id)

# User sends a message to another user
@socketio.on('send_message')
def handle_send_message(data):
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    logger.info(f'User {sender_id} sent a message to user {receiver_id}: {content}')
    
    # Save the message to the database
    if sender_id and receiver_id and content:
        try:
            message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
            db.session.add(message)
            db.session.commit()
            logger.info(f'Message saved to the database')

            logger.info(f"Sending message to room {receiver_id}")
            # Emit message to the receiver's room
            emit('receive_message', {
                'sender_id': sender_id,
                'content': content,
                'timestamp': message.timestamp.isoformat()
            }, room=receiver_id)
            logger.info("Message sent to room")
            user = User.query.get(receiver_id)
            send_notification(receiver_id, "New message", f'New message from {user.Name}')

        except Exception as e:
            logger.error(f'Error saving message to the database: {e}')

# User disconnects from the WebSocket
@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.args.get('user_id')
    if user_id:
        leave_room(user_id)
        logger.info(f'User {user_id} has disconnected')
        emit('status', {'msg': f'User {user_id} has disconnected'}, room=user_id)