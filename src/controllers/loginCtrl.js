'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('loginCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'authApiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, authApiService, swalert) {

  var lg = this;

  lg.buttonMessage = 'LOGIN';
  lg.disableLogginBtn = false;

  lg.login =function(){
    if(!lg.email || !lg.password){

      console.log('please complete the form');
      swalert.toastInfo('please complete the form', 'info', 'top');

    }else{

      swalert.toastInfo('Please wait...', 'info', 'top', 2000);
      $rootScope.route_loader = true;
      // $rootScope.logging_in = true;
      lg.buttonMessage = 'Logging In...';
      lg.disableLogginBtn = true;
      
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      authApiService.getCsrfToken()
        .then(function(response){

            authApiService.validateLogin(credentials)
              .then(function(response){
                let now = new Date();
                let exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
                $cookies.putObject('auth', response.data,  {'expires' : exp});
                $location.path('/dashboard');
            }, function(err){
                lg.buttonMessage = 'LOGIN';
                lg.disableLogginBtn = false;
                $rootScope.route_loader = false;
                swalert.toastInfo(err.data.errors.email, 'error', 'top');
                console.log(err);
            });

      }, function(err){
        console.log(err);
      });

        
    }
  }

}]);
