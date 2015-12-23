var merge = require('merge');
var BaseController = require('../_abstract/BaseController');

module.exports = function(app, req, res, next) {
    var parent = new BaseController(app, req, res, next);

    return merge(Object.create(parent), {
        before: function() {
            res.data = {};
        },
        after: function() {
            res.json(res.data);
        }
    });
};