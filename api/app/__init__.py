import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt 
from datetime import timedelta
from flask_socketio import SocketIO
from time import sleep
from flask_mail import Mail

sleep(20)

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USERNAME'] = None
app.config['MAIL_PASSWORD'] = None
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

jwt = JWTManager(app)
bcrypt = Bcrypt(app) 
app.config.from_object(Config)
db = SQLAlchemy(app)
mail = Mail(app)

socketio = SocketIO(app, cors_allowed_origins="*")

from . import routes, sockets

with app.app_context():
    db.create_all()
