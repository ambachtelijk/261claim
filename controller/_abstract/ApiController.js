"use strict"
var HttpError = require('http-errors');

module.exports = BaseController.extend({
    before: function(next) {
        this.res.type('json');
        this.res.results = [];
        next();
    },
    after: function(next, error) {
        // Everything went just fine
        if(error === undefined) {
            var error = new HttpError(200);
        }
        
        this.res.status(error.status);
        this.res.json({
            status: error.status,
            message: error.message,
            stack: app.get('env') === 'development' && error.status !== 200 ? error.stack.split("\n") : null,
            results: this.res.results
        });
        next();
    },
    errorHandler: function(next, error) {
        this.after(next, error);
    }
});