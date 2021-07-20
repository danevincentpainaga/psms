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
      swalert.toastInfo('please complete the form', 'info', 'top');
    }else{

      swalert.toastInfo('Please wait...', 'info', 'top');
      $rootScope.route_loader = true;
      // $rootScope.logging_in = true;
      lg.buttonMessage = 'Logging In...';
      lg.disableLogginBtn = true;
      
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      // authApiService.getCsrfToken()
      //   .then(function(response){
            authApiService.validateLogin(credentials)
              .then(function(response){
                let now = new Date();
                let exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
                $cookies.putObject('auth', response.data,  {'expires' : exp});
                $location.path('/dashboard');
                $timeout(() => { swalert.toastInfo('Welcome', 'success', 'top-right', 2500); }, 200);
            }, function(err){
                lg.buttonMessage = 'LOGIN';
                lg.disableLogginBtn = false;
                $rootScope.route_loader = false;
                swalert.toastInfo(err.data.error, 'error', 'top');
            });

      // }, function(err){
      //   console.log(err);
      // });
        
    }
  }
  
  // function getCookie(cname) {
  //   let name = cname + "=";
  //   let decodedCookie = decodeURIComponent(document.cookie);
  //   let ca = decodedCookie.split(';');
  //   for(let i = 0; i <ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) == ' ') {
  //       c = c.substring(1);
  //     }
  //     if (c.indexOf(name) == 0) {
  //       return c.substring(name.length, c.length);
  //     }
  //   }
  //   return "";
  // }

  // getCookie('XSRF-TOKEN')

}]);


// app.factory('XSRFInterceptor', [ function() {
//     var readCookie = function(name) {
//         var nameEQ = name + "=";
//         var ca = document.cookie.split(';');
//         for(var i=0;i < ca.length;i++) {
//             var c = ca[i];
//             while (c.charAt(0)==' ') c = c.substring(1,c.length);
//             if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//         }
//         return null;
//     }

//     var XSRFInterceptor = {
//         request: function(config) {
//             var token = readCookie('XSRF-TOKEN');
//             if (token) {
//                 config.headers['X-XSRF-TOKEN'] = token;
//             }
//             return config;
//         }
//     };
//     return XSRFInterceptor;
// }]);

// app.config(['$httpProvider', function($httpProvider) {
//     $httpProvider.interceptors.push('XSRFInterceptor');
// }]);