import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt 
from datetime import timedelta
from flask_socketio import SocketIO
from time import sleep

sleep(10)

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

jwt = JWTManager(app)
bcrypt = Bcrypt(app) 
app.config.from_object(Config)
db = SQLAlchemy(app)

socketio = SocketIO(app, cors_allowed_origins="*")

from . import routes, sockets

with app.app_context():
    db.create_all()
