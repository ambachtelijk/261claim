# 261claim.eu
261claim.eu is a webbased app built on ExpressJS.

## Dependencies
Make sure the following dependencies have been installed on the target machine and are accessible from the project folder.
* Node.js
* NPM (node package manager)
* MySQL
* Nodemon (optional)

## Installation
Make sure to have NodeJS and NPM installed
1. Pull this project from GitHub
2. Run `npm install` in the project directory
3. Create a MySQL database and add the credentials in JSON format to `configs/db.json`
4. Run `node mysql.install.js` (file is not yet included, so don't bother trying)
5. Run `nodemon bin/www` from the project directory
6. By default the app runs locally on port 3000. Go to `http://localhost:3000` in your web browser. Replace `localhost` with the IP address of your server, if the app has been installed remotely
7. Enjoy :)
 
## Routing
A custom routing schedule has been implemented in `router.js` to support autodiscovery of valid routes. Typically, a route has the structure `/<directories>/<controller>/<action>/<params>`. It takes the request path and splits it. Next, the following logic is applied:

1. Shift the first element from `req.path` and test if a directory with this value exists in `app.locals.paths.controllers` (this is the base directory for the controllers).
  1. If `true`, add the value to `req.directory`, apply step 1 with the next element in path.
  2. If `false`, continue to step 2.
2. Shift the first element from `req.path` and add the value to `req.controller`. If `undefined`, default to `index`.
3. Shift the first element from `req.path` and add the value to `req.action`. If `undefined`, default to `index`.
4. Add the remaining elements from `path` to `req.params`.
5. Run the controller in `app.locals.paths.controllers + '/' + req.directory + '/' + req.controller.CamelCase() + 'Controller'` with action `req.action.camelCase() + 'Action'`. The controller is an object and must be an instance of `BaseController`. The controller object must contain the method with the name of the action (e.g. `indexAction: function() {}`). Throw a 404 error if the controller or action do not exist.
### Example
In this example, the directory `./controllers/api` exists, but `./controllers/api/eu261` does not, so `eu261` will be the controller and next `eligible-route` the action.

#### Variables provided by Express: 
 ```
app.locals.paths.controllers = './controllers';
req.path = '/api/eu261/eligible-route/kl/ams/svo';
````
#### Output:
```
req.directory = 'api';
req.controller = 'Eu261'; // Controller value after CamelCase() has been applied
req.action = 'eligibleRoute'; // Action value after camelCase() has been applied
req.params = ['kl', 'ams', 'svo'];

/**
 * The router will add Controller to the value in req.controller and Action to the value in req.action
 */
require('./controllers/api/Eu261Controller').init({ req: req, res: res, next: next });
```
