let configuration = require('../db/configuration.js');
let sessions = require('../db/session.js');
let response = require('../response/response.js');

let configurationApi = {

   /**
    * GET - get all configurations
    * Params - limit:0 (how much objects to return), sort: name(object property to sort by), offset: 0(what index to return)
    */
   getConfiguration: function(req,res, params) {
      if(isAuthenticated(req,res)) {
         let parsedArray = configuration;
         console.log(params);
         //paginate first then sort 
         if(params) {
            if(params.offset) {  //return data from a certain index 
               if(params.offset < configuration.length) {
                  if(params.limit) {   //return limited amount of data 
                     let limitIndex = parseInt(params.offset)  + parseInt(params.limit);
                     parsedArray = configuration.slice(params.offset, limitIndex);
                  }else {  //no limit 
                     parsedArray = configuration.slice(params.offset);
                  }
               }
            }else if(params.limit) {  //no offset
               console.log(params.limit);
               parsedArray = configuration.slice(0,params.limit);
               console.log(parsedArray);
            }

            //sort 
            if(params.sort) {
               let sortParam = params.sort;
               parsedArray.sort((a,b) => {
                  if(a[sortParam] < b[sortParam]) {
                     return -1;
                  }
                  if(a[sortParam] > b[sortParam]) {
                     return 1;
                  }
                  return 0;
               });
            }
         }

         response.successResponse(res,parsedArray);
      }
   },

   /**
    * POST - create new configuration object 
    */
   postConfiguration: function(req, res, body) {
      if(isAuthenticated(req,res)) {
         //make sure request body is valid 
         if(body){
            let config = JSON.parse(body);

            if(!config.name) {
               response.badRequest(res,'Missing name property');
            }

            if(!config.hostname) {
               response.badRequest(res,'Missing hostname property');
            }

            if(!config.port) {
               response.badRequest('Missing port property');
            }

            if(!config.username) {
               response.badRequest(res,'Missing username property');
            }

            let uniqueId = configuration.length + 1;
            config.id = uniqueId;
            configuration.push(config);
            if(configuration.indexOf(config) != -1) {
               let returnConfig = configuration.find((obj) => {
                  return obj.id === config.id;
               });
               response.successResponse(res,returnConfig);

            }else {
               response.internalServerError(res);
            }

         }else {
            response.badRequest(res,'Invalid Body input');
         }
      }
   }, 

   /**
    * PUT - edit existing configuration object base on unique username
    */
   putConfiguration: function(req, res, param, body) {
      if(isAuthenticated(req,res)) {
         if(!param.id) {
            response.badRequest(res, 'param id required');
         }

         if(body) {
            let config = JSON.parse(body);
            let idFound = false;

            for(var i = 0; i < configuration.length; i++) {
               if(configuration[i].id == param.id) {
                  idFound = true;
                  if(config.name) {
                     configuration[i].name = config.name;
                  }
                  if(config.hostname) {
                     configuration[i].hostname = config.hostname;
                  }
                  if(config.port) {
                     configuration[i].port = config.port;
                  }
                  if(config.username) {
                     configuration[i].username = config.username;
                  }
                  break;
               }
            }

            if(idFound) {
               let returnConfig = configuration.find((obj) => {
                  return obj.id === parseInt(param.id);
               })
               response.successResponse(res, returnConfig);

            }else {
               response.dataNotFound(res);
            }

         }else {
            response.badRequest(res,'Invalid Body input');
         }
      }

   }, 

   /**
    * DELETE - delete existing configuration object based on passed in configuration object
    */
   deleteConfiguration: function(req, res, param) {
      if(isAuthenticated(req,res)) {
         if(param.id) {
            let idToDelete = parseInt(param.id);
            let index = configuration.findIndex((obj) => {
               return obj.id === idToDelete;
            });

            if(index != -1) {
               configuration.splice(index,1);
               response.successResponse(res,{
                  success:true,
                  message:'item successfully deleted'
               });
            }else {
               response.badRequest(res,'Deletion failed');
            }

         }else {
            response.badRequest(res,'require id');
         }   
      }
   }
}

//helper function to check is user is authenticated
function isAuthenticated(req,res) {
   const token = req.headers['token'];
   const unauthenticatedResponse = {
      success: 'fail',
      message: 'user not authenticated'   
   }

   if(!token) {
      response.userNotAuthorized(res);
      return false;
   }else {
      let index = sessions.indexOf(token);
      if(index === -1) {
         response.userNotAuthorized(res);
      }
   }
   return true;
}

module.exports = configurationApi;