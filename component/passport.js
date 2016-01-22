"use strict"
var Path = require('path');
var Promise = require('bluebird');
var Passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = app.db.import(Path.join(app.basedir, app.config.path.model, 'User'));
  
Passport.use(new Strategy({
    usernameField : 'email',
    passwordField : 'password',
  },
  function(email, password, next) {
    var user = User.findOne({where: {email: email}}).then(function (user) {
      if (!user || user.password !== password) { return next(null, false); }
      return next(null, user);
    }).catch(function(error) {
      return next(error);
    });
  }
));

Passport.serializeUser(function(user, next) {
  next(null, user.id);
});

Passport.deserializeUser(function(id, next) {
  User.findOne({where: {id: id}}).then(function (user) {
    return next(null, user);
  }).catch(next);
});

module.exports = Passport;