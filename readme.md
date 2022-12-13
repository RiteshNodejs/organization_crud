# CRUD operations for User and Organization,
##  tools  
* node v16.17.1 ,
* npm 9.1.2,
* express 4.18.2 ,
* joi 17.7.0,
* dotenv 16.0.3,
* bcryptjs 2.4.3 ,
* esm 3.2.25,
* jsonwebtoken 8.5.1,
* mongoose 6.7.3;

### 1.Create a new directory/folder for project  name - src
### 2.Create a js file named as app.js
### 3.initialize a new npm project
* npm init -y  
* npm i express
### 4.import express in app.js 
### 5.Setting Up the Server
* mongoose 6.7.3
* mongodb v6.0.2
### 6.Created Router folder for Route.js file
* all routes are created in Route.js
### 7.Middleware folder in utils folder
#### in middleware folder we have 
* 1.authMiddleware , we implement jsonwebtoken (jwt) validation 
* 2.JoiMiddleeare , we implement joi validation with  validation helper that is placed in helper folder.
### 8.helper (folder) in utils folder ->we place comman messages and validation in it 
* 1.messagehelper.js- for res or error messages
* 2.multervalidation.js- for images storage and validation
* 3.response helper.js - for pre defined structure for response 
* 4.validation helper.js- for joi validation structure for input validation 
### CRUD API links & Working 
* #### Register user  post:(localhost:3200/user/register)
  * firstName:required,
  * lastName:required,
  * userName:required, uerName is unique 
  * email:required,
  * password:required , convert by  bcrypt
  * Organization :optional 
  * Organization.Address : optional
  * if user enter any field of address then
  * addressLine1:required, 
  * addressLine2:optional,
  * OrgNo:required,
  * city:required,
  * state:required,
  * country:required,
  * zipCode:required,
* #### Login user  post: (localhost:3200/login)
  * userName:required,
  * password:required,
  * then token is generated ( Token Expiry time : 15 minute)
* #### Profile  get :(localhost:3200/getorg)
  * add token in  Auth/Bearer 
  * In Response it Shows user  details with organization list 
* #### Update user   put:(localhost:3200/user/updateuser) 
  * userName is required 
  * token is required
* #### Add organization post:(localhost:3200/organization/add)
  * orgName: required,
  * address is optional 
  * if any input for address  then=
  * addressLine1:required, 
  * addressLine2:optional,
  * OrgNo:required,
  * city:required,
  * state:required,
  * country:required,
  * zipCode:required,
* #### update organization by id put:(localhost:3200/org/:id)
  * token required and id of organization object  
  * orgName: required,
  * address is optional 
  * if any input for address  then=
  * addressLine1:required, 
  * addressLine2:optional,
  * OrgNo:required,
  * city:required,
  * state:required,
  * country:required,
  * zipCode:required,
* #### list of all Organization with their userName  get:(localhost:3200/allorg)



  
