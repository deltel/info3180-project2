# Photogram 

Update whenever a change is made.

## APIs
All APIs have been coded.

## Views
Login, Register, Explore and Logout functional.
Can follow user, does not prevent multiple follows by a single user or following oneself.

## Testing APIs
Don't know how to use the postman, been giving me problems for a while now. 
Gave up on postman.
APIs seem to be working.

## Functionality
Registration, login, explore view running.
Log out operational.
User is added to database successfully.
Upon login, user is routed to explore.
Upon logout, token removed from local storage.
Preventing unauthorized access needs work.
Currently user is brought to the page and then rerouted. 

## JWT Authorization
Added sir's requires_auth method.

## HTTPBasicAuth
Also added a custom auth decorator. Later removed it.
Was not sure where to put the auth object, placed it in init.py. 
Later commented it out.

## User Details  
Decided to add the posts to the response. 
Making a call to the posts api makes sense though, consider changing.

## Posts  
The photos for each post is stored in the same uploads folder as the profile pictures, not sure if another folder needs to be created to store them separately.
The created_on attribute is stored as a string. Consider converting to a date column.

## Test User Login
Username: luser
Password: password123
First Name: Login
Last Name: User
Email: luser@anon.com
Location: Kingston, Jamaica
Biography: The first user ever logged in
Photo: image.jpg

Username: user3  
Password: monster

Username: user4
Password: password