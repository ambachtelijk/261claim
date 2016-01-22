"use strict"
var HttpError = require('http-errors');
var Promise = require("bluebird");

module.exports = Class.extend({
  config: {
    verb: {}
  },
  before: function(resolve, reject) { resolve(); },
  after: function(resolve, reject) { resolve(); },
  init: function(req, res) {
    this.req = req;
    this.res = res;
  },
  run: function(action, next) {
    Promise.try(function() {
      return new Promise(function(resolve, reject) {
        this.before(resolve, reject);
      }.bind(this));
    }.bind(this)).then(function() {
      return new Promise(function(resolve, reject) {
        return this[action.camelCase() + 'Action'].apply(this, [resolve, reject].concat(this.req.params));
      }.bind(this));
    }.bind(this)).then(function() {
      return new Promise(function(resolve, reject) {
        return this.after(resolve, reject);
      }.bind(this));
    }.bind(this)).catch(function(error) {
      // Delegate if an error handler has been defined
      this.errorHandler(error);
    }.bind(this)).finally(function() {
      // We're done here, continue to the next middleware
      next();
    });
  },
  errorHandler: function(error) {}
});