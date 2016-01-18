"use strict"
var app = angular.module('app');

app.factory('AuthService', function($http) {
    var user = {
        model: {}
    };

    return {
        login: function(credentials) {
            return $http.post('/api/user/login', credentials);
        },
        logout: function(credentials) {  
            return $http.post('/api/user/logout', credentials);
        },
        create: function(credentials) {
            return $http.put('/api/user/create', credentials);
        },
        isLoggedIn: function() {
            return !!user;
        }, 
        user: user,
        refresh: function() {
            $http.get('/api/user/refresh').then(
                function(response) {
                    user.model = response.data.results;
                }, 
                function(response) {
                    user.model = {};
                }
            );
        }
    };
});