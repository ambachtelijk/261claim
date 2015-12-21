var express = require('express');
var fs = require('fs');
var HttpError = require('http-errors');
var Router = express.Router();

/**
 * Implement convention over configuration (CoC) paradigm for basic routing and MVC support
 * Should be in any framework by default
 */
Router.all('/*', function (req, res, next) {
    // Protection against URL injection by only allowing certain characters
    var path = req.path.replace(/[^\w-\/]/g,'').toLowerCase().trim2('/').split('/');
    // Traverse directories in URL
    req.directory = "";
    do {
        if(path[0]) {
            try {
                fs.statSync(req.app.locals.paths.controllers + '/' + req.directory + '/' + path[0]);
                req.directory += "/" + path[0];
            } catch(e) {
                break;
            };
        }
        path.shift();
    } while(path.length > 0);
    
    // Set path to index/index if on root
    req.controller  = path[0] === undefined ? 'index' : path.shift();
    req.action      = path[0] === undefined ? 'index' : path.shift();
    req.route       = (req.directory + '/' + req.controller + '/' + req.action).trim2('/');
    req.params      = path;
    
    // Find the allowed HTTP verbs for this request
    var verbs = [];
    if(req.app.locals.verbs[req.route]) {
        verbs = req.app.locals.verbs[req.route];
    } else if(req.app.locals.verbs[req.action]) {
        verbs = req.app.locals.verbs[req.action];
    } else {
        verbs = req.app.locals.verbs['_default'];
    }

    // Throw Method Not Allowed if unsupported verb
    if(verbs.indexOf(req.method) === -1) {
        throw new HttpError(405);
    }
    
    var path = req.app.locals.paths.controllers + '/' + req.directory + '/' + req.controller.CamelCase() + 'Controller';
    
    // Try to include the Controller
    try {
        require.resolve(path);
    } catch(e) {
        throw new HttpError(404, req.directory + '/' + req.controller.CamelCase() + 'Controller Not Found');
    }
    
    require(path)(req.app, req, res, next).init();
    /*
    // Run the action
    require(path).init({
        res: res,
        req: req,
        next: next
    });*/
});

module.exports = Router;
