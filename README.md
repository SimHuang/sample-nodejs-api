# sample-nodejs-api-
This is an sample api with authentication written in pure nodejs.
This is using in memory storage and no databse is used.
node version: v7.4.0

Node API:
1) Make sure node js is installed
2) Traverse to folder directory using a commandline and execute 'npm start'

**LOGIN (user login token in header for all subsequent api calls)**

#####POST - http://localhost:3000/api/login

#####Body: {
            "username":"sam",
            "password":"123456"
         }

**GET CONFIGURATION**

#####GET - http://localhost:3000/api/configurations

#####PARAMS - limit (NUMBER): Amount of json objects to return 
            offset (NUMBER): index for where the pagination should start
            sort (configuration property e.g: hostname) - sort returned data base on property  

#####HEADERS - token: ${token from login}

**CREATE CONFIGURATION**

#####POST - http://localhost:3000/api/configurations

#####BODY: {
            "name":"ippudo",
            "hostname": "www.simhuang.com",
            "port":3454,
            "username":"express"
         }

#####HEADERS - token: ${token from login}

**UPDATE CONFIGURATION**

#####PUT - http://localhost:3000/api/configurations

#####PARAMS - id (REQUIRED) - id associated with a json data object 

#####BODY: {
            "name":"ippudo",
            "hostname": "www.simhuang.com",
            "port":3454,
            "username":"elixer"
         }

#####HEADERS - token: ${token from login}

**DELETE CONFIGURATION**

#####DELETE - http://localhost:3000/api/configurations

#####PARAMS - id (REQUIRED) - id associated with a json data object for deletion

#####HEADERS - token: ${token from login}

**LOGOUT**

#####HEADERS - token: ${token from login}