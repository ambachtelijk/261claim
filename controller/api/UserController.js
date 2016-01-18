"use strict"
var Promise = require('bluebird');
var HttpError = require('http-errors');
var Path = require('path');
var User = app.db.import(Path.join(app.basedir, app.config.path.model, 'User'));

module.exports = ApiController.extend({
    config: {
        verb: {
            'login': ['POST'],
            'logout': ['POST'],
        }
    },
    loginAction: function (resolve, reject) {
        app.passport.authenticate('local', function(error, user, info, options) {
            if(error) { return reject(error); } 
            if(!user) { return reject(new HttpError(401, 'Invalid username or password'));}
 
            this.req.login(user, function(error) {
                if (error) { return reject(error); }
                
                this.res.results = this.req.user ? JSON.parse(JSON.stringify(this.req.user)) : null;
                return resolve();
            }.bind(this));
        }.bind(this))(this.req, this.res);
    },
    logoutAction: function (resolve, reject) {
        this.req.logout();
        this.res.results = JSON.parse(JSON.stringify(this.req.user)) ;
        resolve();
    },
    createAction: function (resolve, reject) {
        if(!this.req.body.email || !this.req.body.password) {
            return reject(new HttpError(400, 'Username or password not set'));
        }

        return User.findOne({where: {email: this.req.body.email}}).bind(this).then(function(user) {
            if(user) { return reject(new HttpError(500, 'Username already exists')); }
            return User.create(this.req.body).bind(this);
        }).then(function(user) {
            return this.loginAction(resolve, reject);
        }).catch(reject);

    },
    refreshAction: function (resolve, reject) {
        this.res.results = this.req.user ? JSON.parse(JSON.stringify(this.req.user)) : null;
        return resolve();
    }
});