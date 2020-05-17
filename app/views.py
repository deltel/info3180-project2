import os
import json
import jwt
from random import choice, randint
import string

from datetime import datetime, date
from app import app 
# Database imports
from app import db, login_manager
from app.models import Post, UserProfile, Like, Follow
#flask login
from flask_login import login_user, logout_user
#Flask form imports
from app.forms import RegistrationForm, LoginForm, PostForm
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, g, make_response
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
#jwt
from flask import _request_ctx_stack
from functools import wraps
import base64

##
#checkout the read me
##

###
# Utility functions
###

def format_date_joined():
    return datetime.today().strftime("%d %B, %Y")

#returns a string of 10 letters
def random_string():
    letters = string.ascii_letters
    letters = letters + string.digits
    s=""
    return s.join([''.join(choice(letters)) for i in range(randint(10,21))])

#All functions below need work

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, app.config['SECRET_KEY'])

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

#basic http authorization
'''
@auth.verify_password
def verify_password(username, password):
    user = UserProfile.query.filter_by(username=username).first()
    if user is not None and check_password_hash(user.password, password):
        return username

@auth.error_handler
def unauthorized():
    return make_response(jsonify({ 'error': 'Unauthorized access' }), 401)
'''

@app.route('/api/users/register',methods=['POST']) 
def register(): 
    form=RegistrationForm() 
    if request.method == 'POST' and form.validate_on_submit(): 
        username = form.username.data
        password = form.password.data 
        #password is already hashed in the models.py...consider removing the line below
        #password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        firstname = form.username.data
        lastname = form.lastname.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        profile_picture = form.profile_picture.data 
        filename = secure_filename(profile_picture.filename)
        profile_picture.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        joined = format_date_joined()
        
        user = UserProfile(username, password, firstname, lastname, email, location, biography, filename, joined)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({"message": "User successfully registered"}), 201 
    return make_response(jsonify( error=form_errors(form) ), 400)
        
   
@app.route('/api/auth/login',methods=['POST'])
def login():
    form=LoginForm() 
    if request.method=='POST' and form.validate_on_submit():
        username=form.username.data
        password=form.password.data
        #query for the username
        user = UserProfile.query.filter_by(username=username).first()
        #check if user exists an id password corresponds
        if user is not None and check_password_hash(user.password, password):
            # get user id, load into session
            payload = {
                'sub': user.id,
                'username': user.username,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'location': user.location,
                'biography': user.biography,
                'profile_photo': user.profile_photo,
                'joined_on': user.joined_on
            }
            #generate jwt token
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
            #login_user(user)
            return make_response(jsonify({ 'token': token, 'message': 'User successfully logged in.'}), 200)
            #return render_template('index.html', form=form)

    return make_response(jsonify( error=form_errors(form) ), 400)


@app.route('/api/auth/logout', methods=['POST'])
#@login_required
@requires_auth
def logout():
    #logout_user()
    return make_response(jsonify({'message': 'User successfully logged out.'}), 200)

#check readme under heading user_details

@app.route('/api/users/<int:user_id>', methods=['GET'])
@requires_auth
def user_details(user_id):
    user = g.current_user
    posts = Post.query.filter_by(user_id=user_id).all()
    if posts is not None:
        return make_response(jsonify(user=user, posts=posts), 200)
    return make_response(jsonify(user=user, message="No posts have been made."), 200)


@app.route('/api/users/<int:user_id>/posts', methods=['GET'])
@requires_auth
def user_posts(user_id):
    posts = Post.query.filter_by(user_id=user_id).all()
    if posts is not None:
        return make_response(jsonify(posts=posts), 200)
    return make_response(jsonify(message="No posts have been made."), 200)

#check readme under posts heading

@app.route('/api/users/<int:user_id>/posts', methods=['POST'])
@requires_auth
def new_post(user_id):
    form = PostForm()
    if request.method == "POST" and form.validate_on_submit():
        caption = form.caption.data
        photo = form.photo.data

        filename = secure_filename(photo.filename)
        profile_picture.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        created = format_date_joined()
        #adding the post to the database
        post = Post(user_id,filename, caption, created)
        db.session.add(post)
        db.session.commit()

        return make_response(jsonify({
            'message': 'Successfuly created a new post'
            }), 201)
    return make_response(jsonify( error=form_errors(form) ), 400)


@app.route('/api/users/<int:user_id>/follow', methods=['POST'])
@requires_auth
def follow_user(user_id):
    user = g.current_user
    #adding to the followers database
    follow = Follow(user_id, user['sub'])
    db.session.add(follow)
    db.session.commit()

    return make_response(jsonify({
        'message': 'You are now following that user'
        }), 201)


@app.route('/api/users/<int:user_id>/follow', methods=['GET'])
@requires_auth
def follower_count(user_id):
    follows = Follow.query.filter_by(user_id=user_id).all()
    if follows is not None: 
        follower_count = len(follows)
        return make_response(jsonify({'followers': follower_count}), 200)
    return make_response(jsonify({
        'followers': 0, 
        'message': 'No followers'
        }), 200)


@app.route('/api/posts', methods=['GET'])
#@login_required
@requires_auth    
def all_posts():
    posts = db.session.query(Post).all()
    if len(posts) > 0:
        return jsonify(error=None, posts=posts, message='Posts found'), 200
    return make_response(jsonify({'message': 'There are no posts'}), 200)


@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@requires_auth
def like_post(post_id):
    user = g.current_user
    #adding to like database
    like = Like(user['sub'], post_id)
    db.session.add(like)
    db.session.commit()
    #like count
    likes = Like.query.filter_by(post_id=post_id).all()
    like_count = len(likes)
    
    return make_response(jsonify({
        'message': 'Post liked!',
        'likes': like_count
        }), 201)

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
#flask
@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))

# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
