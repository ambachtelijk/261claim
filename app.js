"use strict"
var Fs = require('fs');
var Path = require('path');
var Favicon = require('serve-favicon');
var Less = require('less-middleware');
var Logger = require('morgan');
var Sequelize = require('sequelize');
var CookieParser = require('cookie-parser');
var BodyParser = require('body-parser');
var ExpressSession = require('express-session');


// Load Express.js and create an instance of the app
var Express = require('express');

// App app to the global scope
GLOBAL.app = Express();

// Make the base directory of this app globally available
app.basedir = __dirname;
app.config = {};

try {
  require(Path.join(app.basedir, 'environment'));
} catch (e) {};

// Load all config files
Fs.readdirSync(Path.join(app.basedir, 'config')).forEach(function(filename) {
  if(~filename.indexOf('.json') && !~filename.indexOf('.sample')) {
    app.config[filename.slice(0, filename.indexOf('.json'))] = require(Path.join(app.basedir, 'config', filename));
  }
});

// Add additional JS features
require(Path.join(app.basedir, app.config.path.component, 'php'));

// Preload all abstract controllers
// Each controller has to be loaded in the right order, to prevent fatal exceptions
// because deratives try to extend a class that has not yet been included
app.config.path.controller.abstract.order.forEach(function(level) {
  let suffix = app.config.path.controller.suffix;

  level.forEach(function(controller) {
    let filename = Path.join(
      app.basedir, 
      app.config.path.controller.abstract.location, controller.CamelCase() + suffix
    );

    // Add controller to the global scope
    GLOBAL[controller.CamelCase() + suffix.slice(0, suffix.indexOf('.js'))] = require(filename);
  });
});

// Connect to database
app.db = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  }
);

app.passport = require(Path.join(app.basedir, app.config.path.component, 'passport'));

// Set up view renderer
app.locals.delimiters = '[[ ]]'; // Change Hogan delimiters to avoid conflicts with Angular

app.set('views', app.config.path.view || 'view');
app.set('view engine', 'hjs');

// Front end interaction
//app.use(Favicon(Path.join(__dirname, 'public', 'favicon.ico')));app.use(logger('dev'));
//app.use(require('morgan')('combined'));
app.use(Less(Path.join(app.basedir, app.config.path.public || 'public')));
app.use(Express.static(Path.join(app.basedir, app.config.path.public || 'public')));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(ExpressSession({secret: 'mySecretKey',resave: false,saveUninitialized: false}));

// Load authentication module
app.use(app.passport.initialize());
app.use(app.passport.session());


// This is where the magic happens: route the request
app.use(require(Path.join(app.basedir, app.config.path.component, 'router')));

// Catch errors
app.use(function(error, req, res, next) {
  res
    .status(error.status || 500)
    .render('error', {
      message: error.message,
      error: app.get('env') === 'development' ? error : {}
    });
});
module.exports = app;
