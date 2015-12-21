var merge = require('merge');
var AdminController = require('../_abstract/AdminController');


module.exports = merge(Object.create(AdminController), {
    indexAction: function() {
    }
});