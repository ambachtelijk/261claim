"use strict"
var Path = require('path');
var bCrypt = require('bcrypt-nodejs');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
        
// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
        
module.exports = AdminController.extend({
    indexAction: function(next) {
        this.view.params = {
            title: 'Cancelled or delayed flight? File your claim now',
        };
        this.view.partials = ['header'];
        
        next();
    }
});