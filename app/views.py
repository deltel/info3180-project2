import os
from datetime import datetime, date
from app import app 
# Database imports
from app import db
from app.models import Post, UserProfile, Like, Follow
#Flask form imports
from app.forms import RegistrationForm, LoginForm, PostForm
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename

import json

#All functions below need work
@app.route('/api/users/register',methods=['POST']) 
def register(): 
    form=RegistrationForm() 
    if request.method == 'POST' and form.validate_on_submit(): 
        username=request.form['username']
        password=request.form['password'] 
        #password is already hashed in the models.py...consider removing the line below
        password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        firstname=request.form['firstname']
        lastname=request.form['lastname']
        email=request.form['email']
        location=request.form['location']
        biography=request.form['biography']
        profile_picture=form.profile_picture.data 
        filename=secure_filename(profile_picture.filename)
        profile_picture.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        return jsonify({"message": "New user has been made"}) 
        
   
@app.route('/api/auth/login',methods=['POST'])
def login():
    form=LoginForm() 
    if request.method=='POST' and form.validate_on_submit():
        username=request.form['username']
        password=request.form['password']  
    return render_template('index.html', form = form)

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
