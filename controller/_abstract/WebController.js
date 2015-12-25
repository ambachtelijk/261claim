"use strict"
var merge = require('merge');
var HttpError = require('http-errors');

module.exports = BaseController.extend({
    view: {
        file: '',
        params: {
            partials: []
        }
    },

    before: function(next) {
        this.view.file = this.req.route;
        next();
    },
    after: function(next) {
        if(this.res.headersSent) {
            return true;
        }

        var partials = {};

        // Parse route for partials set not by config
        for(var i = 0; i < this.view.params.partials.length; i++) {
            partials[this.view.params.partials[i]] = this.req.route + '/' + this.view.params.partials[i];
        }

        // Merge partials with configuration partials
        partials = merge({ _content: this.view.file }, this.config.partials, partials);
        // Test if the partials do exist to prevent hard-to-solve issues
        try {
            for(var i in partials) {
                require.resolve('../../' + app.locals.paths.views + '/' + partials[i] + '.hjs');
            }
        } catch(e) {
            next(new HttpError(404, 'Partial ' + partials[i] + ' Not Found'));
        }

        // Do the actial rendering
        this.res.render(this.config.layout, merge.recursive(this.view.params, { partials: partials }));
        next();
    }
});