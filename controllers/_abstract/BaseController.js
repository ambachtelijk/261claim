var merge = require('merge');
var HttpError = require('http-errors');

module.exports = function(app, req, res, next) {
    return {
        config: {},
        before: function() {},
        after: function() {},

        /**
         * 
         * @param {type} args
         * @returns {undefined}
         */
        init: function() {
            // Bind the arguments to this object; typically action, req, res and next
            if(typeof this[req.action.camelCase() + 'Action'] !== 'function') {
                throw new HttpError(404, req.action.camelCase() + 'Action Not Found');
            }

            merge.recursive(this.config, app.locals.web);

            this.before();
            this[req.action.camelCase() + 'Action']();
            this.after();
        }
    };
}