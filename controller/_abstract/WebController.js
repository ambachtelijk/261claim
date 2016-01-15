"use strict"
var merge = require('merge');
var HttpError = require('http-errors');
var Path = require('path');

module.exports = BaseController.extend({
    view: {
        file: '',
        partials: [],
        params: {}
    },
    before: function(next) {
        this.view.file = this.req.route;
        next();
    },
    after: function(next) {
        if(this.res.headersSent) {
            return true;
        }

        var params = this.view.params;
        params.partials = {};
        
        // Parse route for partials set not by config
        for(let i = 0; i < this.view.partials.length; i++) {
            params.partials[this.view.partials[i]] = Path.join(this.req.route, this.view.partials[i]);
        }

        // Merge partials with configuration partials
        params.partials = merge(true, { _content: this.view.file }, this.config.partials, params.partials);

        // Test if the partials do exist to prevent hard-to-solve issues
        for(let i in params.partials) {
            try {
                require.resolve(Path.join(app.basedir, app.config.path.view, params.partials[i] + '.hjs'));
            } catch(e) {
                throw new HttpError(404, 'Partial ' + params.partials[i] + ' Not Found');
            }
        }
        
        // Do the actial rendering
        this.res.render(this.config.layout, params);
        next();
    },
    init: function(req, res) {
        // Load specific settings for the WebController
        this.view = merge(true, this.view, {});
        this.config = merge(true, this.config, app.config.web);
        
        this.parent(req, res);
    },
    errorHandler: function(next, error) {
        this.view.file = 'error';
        this.view.params.error = error;
        this.res.status(error.status);
        this.after(next);
    }
});