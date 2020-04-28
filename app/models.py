from . import db
from werkzeug.security import generate_password_hash

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    photo = db.Column(db.String, nullable=False)
    caption = db.Column(db.String(400), nullable=False)
    #get and format the date in the views.py then store it as a string
    created_on = db.Column(db.String, nullable=False)

    def __init__(self, user_id, photo, caption, created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on

class UserProfile(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(80), nullable=False )
    lastname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    location = db.Column(db.String(200), nullable=False )
    biography = db.Column(db.String(400), nullable=False)
    profile_photo = db.Column(db.String, nullable=False)
    #get and format the date in the views.py then store it as a string
    joined_on = db.Column(db.String, nullable=False)

    def __init__(self, username, password, first, last, email, location, bio, photo, joined_on):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname = first
        self.lastlame = last
        self.email = email
        self.location = location
        self.biography = bio
        self.profile_photo = photo
        self.joined_on = joined_on

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id) #python 2 support
        except NameError:
            return str(self.id)  #python 3 support

    def __rep__(self):
        return '<User %r>' % self.username

class Like(db.Model):
    __tablename__ = "likes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    post_id = db.Column(db.Integer, nullable=False)

    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id

class Follow(db.Model):
    __tablename__ = "follows"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    follower_id = db.Column(db.Integer, nullable=False)

    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id