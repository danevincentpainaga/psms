'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('loginCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'loginApiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, loginApiService) {

  var lg = this;

  lg.buttonMessage = 'LOGIN';
  lg.loginBtn = false;

  lg.login =function(){
    if(!lg.email || !lg.password){
      console.log('please complete the form');
    }else{
      lg.buttonMessage = 'Logging In...';
      lg.loginBtn = true;
      
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      console.log(credentials);
      loginApiService.validateLogin(credentials)
        .then(function(response){
          console.log(response);
          $cookies.putObject('auth', response.data);
          $location.path('/dashboard'); 
      }, function(err){
          console.log(err);
      });
    }
  }

}]);
