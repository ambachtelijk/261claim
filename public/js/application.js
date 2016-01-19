"use strict"
var app = angular.module('app', ['ui.bootstrap', 'ui.select', 'ngSanitize', 'ngMessages', 'angularMoment']);

app.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});

// Directive from https://medium.com/@MohanKethees/quick-angularjs-checkbox-validation-a1ade60a97f4
app.directive('checkRequired', function(){
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.checkRequired = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                var match = scope.$eval(attrs.ngTrueValue) || true;
                return value && match === value;
            };
        }
    }; 
});

// Directive from http://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
app.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});