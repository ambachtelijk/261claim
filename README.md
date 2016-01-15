# 261claim.eu
261claim.eu is a webbased app built on ExpressJS.

### Table of contents
1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [Routing](#routing)
4. [MVC setup](#mvc-setup)
4. [API](#api)

## Dependencies
Make sure the following dependencies have been installed on the target machine and are accessible from the project folder. All the Node.js specific dependencies are defined by `package.json` and don't require separate installation.

* Node.js
* NPM (node package manager)
* MySQL server
* Nodemon (optional)

## Installation

1. Pull this project from GitHub.
2. Run `npm install` in the project directory.
3. Create a MySQL database and import the files `sql/schema.sql` and `sql/data.sql`.
4. Set the [environment variables](#environment-variables) for inclusion on runtime according to one of below methods. Make sure all variables are included in your selected method
 * Create a file named `environment.js` in the same directory as `app.js` exists. The syntax is `process.env.<VARIABLE> = '<value>';`, e.g. `process.env.DB_HOST = 'localhost';`.
 * In Heroku you set these variables on application instance level with the `Config Variables` in the settings panel of your app.
 * As environment variable of your operating system (not recommended) 
5. Run `nodemon bin/www` from the project directory.
6. By default the app runs locally on port 3000. Go to `http://localhost:3000` in your web browser. Replace `localhost` with the IP address of your server, if the app has been installed remotely.
7. Enjoy :).

### Environment variables
All of the following environment variables are required to run the application properly:

* `DB_HOST` contains the MySQL hostname of the application. Typically its value is `localhost`
* `DB_DATABASE` the MySQL database on which the application will run
* `DB_USERNAME` the MySQL username that has full priviliges on the database set in `DB_DATABASE`
* `DB_PASSWORD` the password that belongs to the username set in `DB_USERNAME`

## Routing
A custom routing schema has been implemented in `router.js` to support autodiscovery of valid routes. Typically, a route has the structure `/<directories>/<controller>/<action>/<params>`. It takes the request path and splits it. Next, the following logic is applied:

1. Shift the first element from `req.path` and test if a directory with this value exists in `app.locals.paths.controllers` (this is the base directory for the controllers).
  1. If `true`, add the value to `req.directory`, apply step 1 with the next element in `req.path`.
  2. If `false`, continue to step 2.
2. Shift the first element from `req.path` and add the value to `req.controller`. If `undefined`, default to `index`.
3. Shift the first element from `req.path` and add the value to `req.action`. If `undefined`, default to `index`.
4. Add the remaining elements from `path` to `req.params`.
5. Determine if the request method is an allowed verb for this action. Search for a value in `app.locals.verbs` in the following order:
  1. Take the value of the complete route as identified by the key `<req.directory>/<req.controller>/<req.action>`, if not defined,
  2. Take the value of the action as identified by the key `<req.action>`, if not defined,
  3. Take the default value as identified by the key `_default`.
6. Run the controller in `app.locals.paths.controllers + '/' + req.directory + '/' + req.controller.CamelCase() + 'Controller'` with action `req.action.camelCase() + 'Action'`. The controller is an object and must be an instance of `BaseController`. The controller object must contain the method with the name of the action (e.g. `indexAction: function() {}`). Throw a 404 error if the controller or action do not exist.

### Example
Based on the HTTP request `GET http://localhost:3000/api/eu261/eligible-route/kl/ams/svo`.

#### Values added to `req` after the routing procedure
These variables will be available in the Controller class.
```javascript
req.directory = 'api'; // The directory ./controllers/api exists and will be used
req.controller = 'Eu261'; // Controller value after CamelCase() has been applied
req.action = 'eligibleRoute'; // Action value after camelCase() has been applied
req.route = 'api/Eu261/eligibleRoute';
req.params = ['kl', 'ams', 'svo'];
```

#### Results of the routing procedure
The following controller file and action are parsed. As you can see, the router will add `Controller` to the value in `req.controller` and `Action` to the value in `req.action`.
- Controller file: `./controllers/api/Eu261Controller.js`
- Action: `eligibleRouteAction()`

## MVC setup
### Model

### View

### Controller
A controller file has the following structure. Replace `BaseController` with any controller name in the `controller/_abstract` directory. This directory is automatically included during the bootstrap in `app.js`, so there is no need to explicitly require it in the controller.
```javascript
module.exports = BaseController.extend({
    indexAction: function(next) {
        next();
    }
});
```

## API
You can perform all (S)CRUD operations on the following URI’s via HTTP. `<root>` must be replaced by the base URI of the application (typically the domain name).

### Search: `GET <root>/api/country/search/<column>/<query>`
* `<column>` can take the values `name`, `id`, `alpha2` or `alpha3`
* `<query>` is a string with the search value
* Returns an array of countries that match the criteria
### Read: `GET <root>/api/country/read/<id>`
* `<id>` is a string with the ISO 3166-1 ID code
* Returns an object with the inserted data on success.

### Create: `PUT/POST <root>/api/country/create`
* Accepts these PUT/POST parameters. 
 * `id` (Required, Unique, Integer (4), ISO 3166-1 ID code)
 * `alpha2` (Required, Unique, CHAR(2), ISO 3166-1 Alpha 2 code)
 * `alpha3` (Required, Unique, CHAR(3) ISO 3166-1 Alpha 3 code)
 * `name` (Required, Unique, Varchar(64) UNGEGN Country name)
 * `alt_name` (Optional, Unique or NULL, Varchar(64) name as most commonly used)
* Returns an object with the inserted data on success.

### Update: `PUT/PATCH <root>/api/country/update/<id>`
* `<id>` is a string with the ISO 3166-1 ID code
* Accepts these PUT/PATCH parameters. 
 * `alpha2` Required, Unique, CHAR(2), ISO 3166-1 Alpha 2 code)
 * `alpha3` (Required, Unique, CHAR(3) ISO 3166-1 Alpha 3 code)
 * `name` (Required, Unique, Varchar(64) UNGEGN Country name)
 * `alt_name` (Optional, Unique or NULL, Varchar(64) name as most commonly used)
* Returns an object with the inserted data on success.

### Delete: `DELETE <root>/api/country/delete/<id>`
 * `<id>` is a string with the ISO 3166-1 ID code
 * Returns status code 200 on success.
