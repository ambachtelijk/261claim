"use strict"
var HttpError = require('http-errors');

module.exports = BaseController.extend({
    before: function(resolve, reject) {
        this.res.type('json');
        this.res.results = [];
        resolve();
    },
    after: function(resolve, reject, error) {
        // Everything went just fine
        if(error === undefined) {
            var error = new HttpError(200);
        }

        // Not all errors are compatible with HttpError
        if(!error.status) { error.status = 500; }
        this.res.status(error.status);
        this.res.json({
            status: error.status,
            message: error.message,
            stack: app.get('env') === 'development' && error.status > 400 ? error.stack.split("\n") : null,
            results: this.res.results
        });
        
        // Only resolve if there have been no errors and we're still in the BaseController Promise chain
        if(resolve) {
            resolve();
        }
    },
    errorHandler: function(error) {
        this.after(null, null, error);
    }
});