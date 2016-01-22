"use strict"
var HttpError = require('http-errors');
var Path = require('path');
var Airline = app.db.import(Path.join(app.basedir, app.config.path.model, 'Airline'));

module.exports = ApiController.extend({
  searchAction: function(resolve, reject, key, value) {
    if(value === undefined) {
      value = '';
      //throw new HttpError(400, 'Request did not match expected formatting, e.g. country/search/name/Netherlands');
    }
    
    
    // Compose query
    let where = {};
    switch(key) {
      case 'name':
        where[key] = {$like: '%'+value+'%'};
        break;
      case 'iata':
      case 'iaco':
        where[key] = value;
        break;
      case 'all':
        where['$or'] = [
          {name: {$like: '%'+value+'%'}}, 
          {iata: {$like: '%'+value+'%'}},
          {icao: {$like: '%'+value+'%'}}
        ];
        break;
      default:
        throw new HttpError(400, 'Invalid key (' + key + '), please use name, iata, iaco or all');
    }

    return Airline.findAll({where: where}).bind(this).then(function(airlines) {
      this.res.results = JSON.parse(JSON.stringify(airlines));
      resolve();
    });
  }
});