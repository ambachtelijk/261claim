"use strict"
var Path = require('path');

module.exports = WebController.extend({
  indexAction: function(resolve, reject) {
    resolve();
  },
  createAction: function(resolve, reject) {
    this.view.params.title = 'Cancelled or delayed flight? File your claim now';
    
    this.view.partials = ['../_form'];
    
    resolve();
  },
  updateAction: function(resolve, reject) {
    this.view.params.title = 'Cancelled or delayed flight? File your claim now';
    this.view.partials = ['../_form'];
    
    resolve();
  }
});