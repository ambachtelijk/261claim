"use strict"
module.exports = WebController.extend({
    indexAction: function(next) {
        this.view.params = {
            title: 'Cancelled or delayed flight? File your claim now',
        };
        this.view.partials = ['header'];
        
        next();
    },
    after: function(next) {
        // Set suffix to title
        this.view.params.title = this.view.params.title + ' | 261claim.eu';
        
        this.parent(next);
        next();
    }
});