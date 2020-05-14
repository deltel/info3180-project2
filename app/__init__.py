from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
#from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
csrf = CSRFProtect(app)
#auth = HTTPBasicAuth()
app.config['UPLOAD_FOLDER'] = './app/static/upload'
app.config['SECRET_KEY'] = 'iejf9003r-t4jf8jdm3201idjfnasd'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://project2:password007@localhost/db_project2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

#Flask-login to login_manager
login_manager =LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)

from app import views, models