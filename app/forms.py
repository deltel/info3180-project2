from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.fields import StringField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, Email

#Registration form
class RegistrationForm(FlaskForm):
    username=StringField("Username",validators=[DataRequired() ]) 
    password=PasswordField("Password",validators=[DataRequired()]) 
    firstname=StringField("First Name",validators=[DataRequired()]) 
    lastname=StringField("Last Name",validators=[DataRequired()]) 
    email=StringField("Email",validators=[DataRequired(),Email()]) 
    location=StringField("Location",validators=[DataRequired()]) 
    biography=TextAreaField("Biography",validators=[DataRequired()]) 
    profile_picture=FileField("Profile Picture",validators=[
        FileRequired(),
        FileAllowed(['jpg','png','Images only!'])
        ])  

#login form
class LoginForm(FlaskForm): 
    username=StringField("Username",validators=[DataRequired()]) 
    password=PasswordField("Password",validators=[DataRequired()])

#new post form
class PostForm(FlaskForm):
    photo = FileField("Photo",validators=[
        FileRequired(),
        FileAllowed(['jpg','png','Images only!'])
        ])
    caption = TextAreaField("Caption", validators=[DataRequired()])