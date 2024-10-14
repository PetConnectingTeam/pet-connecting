import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt 
from datetime import timedelta


app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

bcrypt = Bcrypt(app) 
app.config.from_object(Config)

db = SQLAlchemy(app)

from . import routes 
