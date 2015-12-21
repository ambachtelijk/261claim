var php = require('./php'); 
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var less = require('less-middleware');
var logger = require('morgan');
//var mysql = require('mysql');
var Sequelize = require('sequelize');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Load Express.js and create an instance of the app
var express = require('express');
var app = express();


// Load all config files
fs.readdirSync('./configs').forEach(function(filename) {
    if(~filename.indexOf('.json')) {
        app.locals[filename.slice(0, filename.indexOf('.json'))] = require('./configs/' + filename);
    }
});


// Connect to database
var db = new Sequelize(app.locals.db.database, app.locals.db.username, app.locals.db.password, app.locals.db.options);
app.use(function(req, res, next) {
    req.db = db;
    next();
});

// Set up view renderer
app.locals.delimiters = '[[ ]]'; // Change Hogan delimiters to avoid conflicts with Angular
app.set('views', app.locals.paths.views);
app.set('view engine', 'hjs');


// Front end interaction
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// This is where the magic happens: route the request
app.use(require('./router'));

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
