"use strict"
module.exports = WebController.extend({
  indexAction: function(resolve, reject) {
    this.view.params = {
      title: 'Cancelled or delayed flight? File your claim now',
    };
    this.view.partials = ['header'];
    
    resolve();
  },
  faqAction: function(resolve, reject) {
    resolve();
  },
  legalAction: function(resolve, reject) {
    resolve();
  },
  contactAction: function(resolve, reject) {
    resolve();
  },
  after: function(resolve, reject) {
    // Set suffix to title
    this.view.params.title = this.view.params.title + ' | 261claim.eu';
    
    this.parent(resolve, reject);
    resolve();
  }
});