from . import db
from datetime import datetime

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(80), nullable=False )
    lastName = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String, nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    location = db.Column(db.String(200), nullable=False )
    biography = db.Column(db.String(400), nullable=False)
    photo = db.Column(db.String, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, first, last, gender, email, location, bio, photo):
        self.firstName = first
        self.lastName = last
        self.gender = gender
        self.email = email
        self.location = location
        self.biography = bio
        self.photo = photo

    def __rep__(self):
        return '<User %r>' % self.email


