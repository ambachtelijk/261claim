"use strict"
var Promise = require('bluebird');
var HttpError = require('http-errors');
var Path = require('path');
var User = app.db.import(Path.join(app.basedir, app.config.path.model, 'User'));
var UserClaim = app.db.import(Path.join(app.basedir, app.config.path.model, 'user/Claim'));
UserClaim.belongsTo(User, {'foreignKey': 'user_id'});

module.exports = ApiController.extend({
  searchAction: function(resolve, reject, key, value) {
    if(typeof value === 'undefined' || !value) {
      throw new HttpError(400, 'Request did not contain a search value');
    }
    
    // Compose query
    var where = {};
    switch(key) {
      case 'id':
      case 'user_id':
        where[key] = value;
        break;
      default:
        throw new HttpError(400, 'Invalid key (' + key + '), please use id or user_id');
    }
    
    return UserClaim.findAll({where: where}).bind(this)
      .then(function(userClaim) {
        this.res.results = userClaim;
        resolve();
      }).catch(reject);
  },
  createAction: function(resolve, reject) {
    if(!this.req.body.user_id) {
      return reject(new HttpError(400, 'Compulsory field user_id not set'));
    }

    return UserClaim.create(this.req.body)
      .then(function(userClaim) {
        resolve();
      }.bind(this)).catch(reject);
  },
  readAction: function(resolve, reject, id) {
    return UserClaim.findOne({id: id, include: [User]}).bind(this)
      .then(function(userClaim) {
        this.res.results = userClaim;
        resolve();
      })
      .catch(reject);
    resolve();
  },
  updateAction: function(resolve, reject, id) {
    if(id === undefined) {
      throw new HttpError(400, 'Request did not match expected formatting, e.g. user/claim/update/<id>');
    }
    
    return UserClaim.findById(id).bind(this)
      .then(function(userClaim) {
        return userClaim.updateAttributes(this.req.body);
      })
      .then(function(userClaim) {
        this.res.data = JSON.parse(JSON.stringify(userClaim));
        resolve();
      })
      .catch(reject);
  },
  deleteAction: function(resolve, reject) {
    resolve();
  }
});