var merge = require('merge');
var HttpError = require('http-errors');

module.exports = {
    config: {},
    before: function() {},
    after: function() {},

    /**
     * 
     * @param {type} args
     * @returns {undefined}
     */
    init: function(args) {
        // Bind the arguments to this object; typically action, req, res and next
        merge(this,args);
        if(typeof this[this.req.action + 'Action'] !== 'function') {
            throw new HttpError(404, this.req.action + 'Action Not Found');
        }
        
        
        merge.recursive(this.config,this.req.app.locals.web);
        
        this.before();
        this[this.req.action + 'Action']();
        this.after();
    }
};