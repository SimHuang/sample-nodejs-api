//http response used for api
let response = {

   successResponse: function(res,body) {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify(body));
   },

   successNoResponse: function(res) {
      res.statusCode = 204;
      res.end();
   },

   badRequest: function(res, errorMessage) {
      res.writeHead(400, {'Content-Type':'application/json'});
      res.end(JSON.stringify({
         success: false,
         message: errorMessage
      }));
   },

   userNotAuthorized: function(res) {
      res.writeHead(403, {'Content-Type':'application/json'});
      res.end(JSON.stringify({
         success: false,
         message: 'user not authorized for application'
      }));
   },

   urlNotFound: function(res) {
      res.statusCode = 404;
      res.end('url not found');
   },

   dataNotFound: function(res) {
      res.statusCode = 404;
      res.end('data not found');
   },

   methodNotFound: function(res) {
      res.statusCode = 405;
      res.end('method found allowed');
   },

   internalServerError: function(res) {
      res.statusCode = 500;
      res.end('Server Error');
   } 
}

module.exports = response;