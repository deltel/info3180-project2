from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['UPLOAD_FOLDER'] = './app/static/upload'
app.config['SECRET_KEY'] = 'njsdbapdmakdoruer389r9ejfdnfio'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://project2:password007@localhost/db_project2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import views, models