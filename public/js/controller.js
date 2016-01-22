"use strict"
var app = angular.module('app');

app.controller('ApplicationController', function($scope, $rootScope, AuthService) {
  AuthService.refresh();
  $scope.isLoggedIn = AuthService.isLoggedIn();
  $scope.user = AuthService.user;
  $scope.setUser = function(user) {
    $scope.user = user;
    if($scope.user.model) {
      $rootScope.$broadcast('USER_SIGNIN');
    }
  }
});

app.controller('UserClaimController', function($scope, $http, $uibModal, AuthService) {
  $scope.claims = [];
  $scope.claim = {};
  $scope.actionIndex = function () {
    $scope.$on('USER_SIGNIN', function () {
      $scope.claims = null;
      
      $http.get('/api/user/claim/search/user_id/' + $scope.user.model.id).then(function(response) {
        $scope.claims = response.data.results;
      }, function(error) {
        $scope.error = error.data;
        $scope.claims = false;
      });
    });
  }
  
  $scope.$on('USER_SIGNIN', function() {
    $scope.claim.user_id = $scope.user.model.id;
  });

  $scope.actionUpdate = function(id) {
    $http.get('/api/user/claim/read/' + $scope.user.model.id).then(function(response) {
      $scope.claim = response.data.results;
      $scope.claim.legs = [{
        'number': 335,
        'airline': {
          'iata': 'TK',
          'name': 'Turkish Airlines'
        },
        'origin': {
          'iata': 'GYD'
        },
        'destination' : {
          iata: 'IST'
        },
        'date': 'Monday, 18 Jan 2016',
        'departure': '20:55 AZT',
        'arrival': '22:15 EET',
        'actualDeparture': 'Cancelled',
        'actualArrival': 'Cancelled',
        'distance': '659'
      }]
    }, function(error) {
      $scope.error = error.data;
    });
  }

  $scope.save = function() {
    if(!$scope.user.model) {
      var loginRequiredModal = $uibModal.open({
        templateUrl: '/modal/user/claim/login-required.html',
        controller: 'UserClaimModalController',
        size: 'md',
        scope: $scope
      });
      
      $scope.$on('USER_SIGNIN', function() {
        loginRequiredModal.dismiss();
        $scope.save();
      });
      
      return;
    }
    
    $http.put('/api/user/claim/' + $scope.action, $scope.claim)
      .then(function(response) {
        console.log(response);
      }, function(error) {
        console.log(error);
      });
  }
});

app.controller('UserClaimModalController', function($rootScope, $scope, $uibModalInstance) {
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }
});

app.controller('FlightDataModalController', function($scope, $q, $http, $uibModalInstance) {

  $scope.loadedLegs = false;
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }
  
  $scope.legsModal = [];
  
  var promises = [];
  $scope.legs.forEach(function(leg) {
    if(!leg || !leg.airline || !leg.date || !leg.flight) {
      return;
    }
    $scope.legsModal.push(leg);
  });
  
  
  $scope.legsModal.forEach(function(leg) {
    promises.push($http({
      url: '/api/flight/search', 
      method: 'GET',
      params: {
        date: leg.date.getFullYear() + '-' + leg.date.getMonth() + 1 + '-' + leg.date.getDate(),
        icao: leg.airline.icao,
        flight: leg.flight
      }
    }).then(
      function(response) {
        leg.flights = response.data.results;
      }, 
      function(response) {
        leg.flights = false;
      }
    ));
  });
  
  if(promises.length > 0) {
    $q.all(promises).then(function() {
      $scope.loadedLegs = true;
    });
  } else {
    console.log('loaded');
    $scope.loadedLegs = true;
  }
});

app.controller('UserController', function($scope, $http, $uibModal, AuthService) {
  function modal(action) {
    event.preventDefault();
    return $uibModal.open({
      templateUrl: '/modal/user/' + action + '.html',
      controller: 'UserModalController',
      size: 'md',
      scope: $scope
    });
  };
  
  $scope.$on('userSignIn', function() { return modal('sign-in'); });
  $scope.$on('userSignUpSuccess', function() { return modal('sign-up-success'); });
  $scope.$on('userSignUp', function() { return modal('sign-up'); });
  $scope.$on('userSignOut', function() { AuthService.logout().then(function() { $scope.setUser(); }); });
  
  
});

app.controller('UserModalController', function($rootScope, $scope, $uibModalInstance, AuthService) {
  var type = '';
  
  $scope.userModalModel = { remember: true }
  $scope.userModalError = false;
  $scope.submitted = false;
  
  $scope.cancel = function() { $uibModalInstance.dismiss(); }
  $scope.close = function() { $uibModalInstance.close(); }
  
  $scope.signInValidate = function() {
    type = 'SIGNIN';
    AuthService.login($scope.userModalModel).then(success, error);
  };
  
  $scope.signUpValidate = function() {
    type = 'SIGNUP';
    $scope.submitted = true;
    
    if(!$scope.userModalForm.$invalid) {
      AuthService.create($scope.userModalModel).then(success, error);
    }
  }
  
  function success(response) {
    $scope.userModalError = false;
    $scope.setUser({ model: response.data.results });
    $uibModalInstance.close();
    
    switch(type) {
      case 'SIGNUP':
        // Show success message
        return $scope.userSignUpSuccess();
        break;
    }
  }
  
  function error(response) {
    $scope.userModalError = response.data;
  }
});

app.controller('IndexHeaderController', function($scope, $http, $element, $window, $uibModal) {
  // Circumvent bug in Angular that prevents propagation if date is not defined as new Date(yyyy, MM, dd)
  var today = new Date();
  $scope.yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  $scope.yesterday.setDate($scope.yesterday.getDate() - 1);
  $scope.legs = [];
  
  
  
  // This property needs to be in a method, otherwise it does not get updated
  $scope.hasMaxLegs = function() { return !($scope.legs.length < 5); };
  
  $scope.create = function() {
    if(!$scope.hasMaxLegs()) {
      // Copy last element's airline and date
      $scope.legs.push($scope.legs.length > 0 ? {
        date: $scope.legs[$scope.legs.length - 1].date,
        airline: $scope.legs[$scope.legs.length - 1].airline
      } : {
        date: $scope.yesterday
      });

      // Make sure the appropriate classes are added
      angular.element($window).trigger('resize'); 
    }
  }
  
  $scope.delete = function(i) {
    $scope.legs.splice(i, 1);
  }
  
  $scope.airlines = [];
  $scope.getAirlines = function(query) {
    // Do not GET anything if query less than 2 characters 
    if(query.length < 2) {
      $scope.airlines = [];
      return;
    }

    $http.get('/api/airline/search/all/'+query, {
    }).then(function(response){
      $scope.airlines = response.data.results
      $scope.airlines.forEach(function(airport, i) {
        $scope.airlines[i].matchedBy = airport.iata === query.toUpperCase() ? 'IATA' : 'Airport';
      });
      
      // Make sure that the IATA code match always appears on top
      $scope.airlines.sort(function(a, b) {
        if(a.matchedBy === 'IATA' && b.matchedBy !== 'IATA') { return -1; }
        if(b.matchedBy === 'IATA' && a.matchedBy !== 'IATA') { return 1; }
        return a.name.localeCompare(b.name);
      });
    });
  };
 
  /**
   * 
   * @todo add validation for input
   */
  $scope.getFlightData = function() {
    $scope.legs.forEach(function(leg) {
      leg.flights = null;
    });
    event.preventDefault();
    return $uibModal.open({
      templateUrl: '/modal/flightData.html',
      controller: 'FlightDataModalController',
      size: 'md',
      scope: $scope
    });
  }
  
  if($window.matchMedia) {
    var resize;
    angular.element($window).bind('resize', function() {
      // Prevent the client from overloading
      clearTimeout(resize);
      resize = setTimeout(function() {
        if($window.matchMedia('(min-width: 480px)').matches) {
          $element.find('.form-group').addClass('form-group-lg');
          $element.find('.input-group').addClass('input-group-lg');
          $element.find('.action.row button').addClass('btn-lg');
          $element.find('.btn-close a').addClass('form-text');
        } else {
          $element.find('.form-group').removeClass('form-group-lg');
          $element.find('.input-group').removeClass('input-group-lg');
          $element.find('.action.row button').removeClass('btn-lg');
          $element.find('.btn-close a').removeClass('form-text');
        }
      }, 50);
    }).trigger('resize');
  }
});
