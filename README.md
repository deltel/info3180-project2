# Photogram 

Update whenever a change is made.

## APIs
All APIs have been coded.

## Testing APIs
Don't know how to use the postman, been giving me problems for a while now. 
So APIs may need additional work.

## Functionality
Registration view running.
User is added to database successfully. 

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