import os
from app import app 
# Database imports
from app import db
from app.models import UserProfile
#Flask form imports
from app.forms import ProfileForm
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename


@app.route("/")
def home():
    """Render website's home page."""
    return render_template('home.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/profile", methods=["GET", "POST"])
def add_user():
    form = ProfileForm()

    if request.method == "POST" and form.validate_on_submit():

        photo = form.photo.data
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename) )

        flash('Profile photo stored', 'success')

        user = UserProfile(form.firstName.data, form.lastName.data, form.gender.data, 
        form.email.data, form.location.data, form.biography.data, filename)
        
        db.session.add(user)
        db.session.commit()

        flash('New user successfully added', 'success')

        return redirect(url_for('show_profiles') )
    return render_template("view.profile.html", form=form)

@app.route("/profiles")
def show_profiles():
    users = db.session.query(UserProfile).all()
    if users:
        return render_template('show-users.html', users=users)
    flash("No users in database.", 'danger')
    return redirect(url_for('add_user') )

@app.route("/profile/<userid>")
def profile_details(userid):
    user = UserProfile.query.get(userid)
    return render_template("profile-details.html", user=user)
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
    and also to cache the rendered page for 10 minutes.
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
