var merge = require('merge');
var AdminController = require('../_abstract/AdminController');

module.exports = function(app, req, res, next) {
    var parent = new AdminController(app, req, res, next);
    
    return merge(Object.create(parent), {
        indexAction: function() {
        }
    });
};