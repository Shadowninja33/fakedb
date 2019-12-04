# BabyDriverDB
Database code for the Baby Driver project

After containers boot up, access the node server at http://localhost:3000/


To create an account, send a PUT request to http://localhost:3000/createuser with a JSON body { "email": "ANEMAIL@DOMAIN.COM", "password": "SOMEPASSWORD", "status": true/false }


To login, send a POST request to http://localhost:3000/login with a JSON body { "email": "USEREMAIL@DOMAIN.COM", "password": "USERPASSWORD" }


To logout, send a DELETE request to http://localhost:3000/logout


To view user logged on as, send a GET request to http://localhost:3000/current


To update email, send a POST request with an active user session to http://localhost:3000/user/update/email with a JSON body { "email": "NEWEMAIL@DOMAIN.COM" }


To update phoneNum, send a POST request with an active user session to http://localhost:3000/user/update/phone with a JSON body { "phone_num": "1 (123) 456-7890" }


To update password, send a POST request with an active user session to http://localhost:3000/user/update/password with a JSON body { "password": "NEWPASSWORD" }


To get profile picture, send a GET request with an active user session to http://localhost:3000/picture/:userId with the id of a user


To update profile picture, send a PUT request with an active user session to http://localhost:3000/picture with multipart form data named "picture" that contains the png image to upload


To delete profile picture, send a DELETE request with an active user session to http://localhost:3000/picture
