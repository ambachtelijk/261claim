"use strict"
var Path = require('path');

module.exports = WebController.extend({
  indexAction: function(resolve, reject) {
    this.view.params = {
      title: 'Cancelled or delayed flight? File your claim now',
    };
    
    resolve();
  }
});