var merge = require('merge');
var WebController = require('./_abstract/WebController');

module.exports = merge(Object.create(WebController), {
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
        WebController.after.call(this);
    }
});