var merge = require('merge');
var WebController = require('./_abstract/WebController');

module.exports = function(app, req, res, next) {
    var parent = new WebController(app, req, res, next);
    
    return merge(Object.create(parent), {
        indexAction: function() {
            this.view.params = {
                title: 'Cancelled or delayed flight? File your claim now',
                currentTitle: 'Foo',
                partials: ['header']
            };
        },
        after: function() {
            // Set suffix to title
            this.view.params.title = this.view.params.title + ' | 261claim.eu';
            parent.after.call(this);
        }
    });
}