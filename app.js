const http = require('http');
const querystring = require('querystring');
const url = require('url');
const authentication = require('./api/authentication.js');
const configurations = require('./api/configurations.js');
const sessions = require('./db/session.js');
const response = require('./response/response.js');

const hostname = '127.0.0.1';
const port = 3000;

function requestListener(req,res) {
   let urlObject = url.parse(req.url);
   let requestUrl = urlObject.pathname;

   if(requestUrl === '/api/login') {
      if(req.method === 'POST') {
         let reqBody = '';
         req.on('data', (chunk) => {
            reqBody += chunk;
         });
         
         //once all body has been recieved
         req.on('end', () => {
            console.log('POST - /api/login');
            authentication.login(req,res,reqBody);
         });
      }else {
         response.methodNotFound(res);
      }

   }else if(requestUrl === '/api/logout') {
      if(req.method === 'POST') {
         console.log('POST - /api/logout');
         authentication.logout(req,res);

      }else {
         response.methodNotFound(res);
      }
      
   }else if(requestUrl === '/api/configurations') {
      switch(req.method) {

         case 'GET':
            //check for url params 
            if(urlObject.search) {
               let paramObject = querystring.parse(urlObject.search.replace('?',''));
               console.log('GET - /api/configurations');
               configurations.getConfiguration(req,res,paramObject);
            }else {
               console.log('GET - /api/configurations');
               configurations.getConfiguration(req,res);
            }
            break;

         case 'POST':
            let postBody = '';
            req.on('data', (chunk) => {
               postBody += chunk;
            });

            req.on('end', () => {
               console.log('POST - /api/configurations');
               configurations.postConfiguration(req,res,postBody);
            });
            break;

         case 'PUT':
            if(urlObject.search) {  //make sure there is an id param 
               let putBody = '';
               req.on('data', (chunk) => {
                  putBody += chunk;
               });

               req.on('end', () => {
                  console.log('PUT - /api/configurations');
                  let paramObject = querystring.parse(urlObject.search.replace('?',''));
                  configurations.putConfiguration(req, res, paramObject, putBody);
               });
            }else {
               response.badRequest(res,'Require id param');
            }
            break;

         case 'DELETE':
            if(urlObject.search) {
               let deleteBody = '';
                  req.on('data', (chunk) => {
                     deleteBody += chunk;
               });

               req.on('end', () => {
                  console.log('DELETE - /api/configurations');
                  let paramObject = querystring.parse(urlObject.search.replace('?',''));
                  configurations.deleteConfiguration(req,res,paramObject);
               });

            }else {
               response.badRequest(res,'Require id param');
            }
            break;

         default:
            response.methodNotFound(res);
      } 
   
   //TESTING API
}else if(requestUrl === '/api/sessions') {
      response.successResponse(res,sessions);
   
   }else {
      response.urlNotFound(res);
   }
} 

const server = http.createServer(requestListener);

//listen at port 3000 
server.listen(port, hostname, () => {
   console.log('server listening at http://' + hostname + ':' + port + '/');
});

