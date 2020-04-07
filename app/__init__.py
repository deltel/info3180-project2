from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './app/static/uploads'
app.config['SECRET_KEY'] = 'shduh82h929y23hdehewhded2'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://orrcggkqmcrpdq:3be50592581b015f1320b359eda972f3727cbd60eea08ce4b47de275d8b9c7a3@ec2-18-235-20-228.compute-1.amazonaws.com:5432/d11efn6005ni65'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import views, models