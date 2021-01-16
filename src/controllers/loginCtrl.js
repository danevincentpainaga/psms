'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('loginCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'loginApiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, loginApiService, swalert) {

  var lg = this;

  lg.buttonMessage = 'LOGIN';
  lg.disableLogginBtn = false;

  lg.login =function(){
    if(!lg.email || !lg.password){

      console.log('please complete the form');
      swalert.toastInfo('please complete the form', 'info', 'top');

    }else{

      swalert.toastInfo('Please wait...', 'info', 'top', 2000);
      $rootScope.logging_in = true;
      lg.buttonMessage = 'Logging In...';
      lg.disableLogginBtn = true;
      
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
          lg.buttonMessage = 'LOGIN';
          lg.disableLogginBtn = false;
          $rootScope.logging_in = false;
          swalert.toastInfo(err.data.errors.email, 'error', 'top');
          console.log(err);
      });
        
    }
  }

}]);
