let crypto = require('crypto');
let users = require('../db/user.js');
let sessions = require('../db/session.js');
let response = require('../response/response.js');

const _SECRET_KEY = 'hakuna matata';

let authentication = {

   login: function(req,res,body) {
      const sessionTime =  18000000;  //single log in session last 10 minutes

      if(body) {
         let credentials = JSON.parse(body);
         if(!credentials.username) {
            response.badRequest(res,'require username property');
         }

         if(!credentials.password) {
            response.badRequest(res,'require password property');
         }

         let username = credentials.username;
         let password = credentials.password;
         if(isUserExist(username, password)) {
            let token = crypto.randomBytes(32).toString('hex');
            sessions.push(token);
            setTimeout((token)=> {
               let index = sessions.indexOf(token);
               sessions.splice(index,1);
               console.log('session deleted');
            }, sessionTime);

            //return this if authenticated
            let successResponse = {
               token: token, 
               success: true,
               message: 'user authenticated'
            }
            response.successResponse(res,successResponse);

         } else {
            response.userNotAuthorized(res);
         }

      } else {
         response.badRequest(res,'invalid JSON input');
      }
   },
   
   //user does not need to know whether log out was successful 
   logout: function(req,res) { 
      const token = req.headers['token'];
      if(token) {
         let index = sessions.indexOf(token);
         if(index > -1) {
            sessions.splice(index,1);
         }
      }
      response.successNoResponse(res);
   }

};

//check if user exist in database 
function isUserExist(username, password) {
   let validCredential = false;
   users.forEach((user) => {
      if((user.username === username) && (user.password === password)) {
         validCredential = true;
      }
   });
   return validCredential;
}

module.exports = authentication;