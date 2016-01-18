"use strict"
var HttpError = require('http-errors');
var Path = require('path');
var Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));

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
                where['$or'] = [{name: {$like: '%'+value+'%'}},{alt_name: {$like: '%'+value+'%'}}];
                break;
            case 'id':
            case 'alpha2':
            case 'alpha3':
                where[key] = value;
                break;
            case 'all':
                break;
            default:
                throw new HttpError(400, 'Invalid key (' + key + '), please use name, id, alpha2 or alpha3');
        }

        return Country.findAll({where: where}).bind(this).then(function(countries) {
            this.res.data = JSON.parse(JSON.stringify(countries));
            resolve();
        });
    },
    createAction: function(resolve, reject) {
        return Country.create(this.req.body).bind(this).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
            resolve();
        });
    },
    readAction: function(resolve, reject, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/read/id');
        }
        
        return Country.findById(id).bind(this).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
        }).then(next);
    },
    updateAction: function(resolve, reject, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/update/id');
        }
        
        return Country.findById(id).bind(this).then(function(country) {
            return country.updateAttributes(this.req.body);
        }).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
        }).then(resolve);
    },
    deleteAction: function(resolve, reject, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/delete/id');
        }
        
        return Country.findById(id).bind(this).then(function(country) {
            return country.destroy();
        }).then(resolve);
    }
});