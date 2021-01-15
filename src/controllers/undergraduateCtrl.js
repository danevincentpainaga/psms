'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('undergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'debounce', 'moment',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, debounce, moment) {

  var uc = this;

  function getNewScholars(searched){
     scholarApiService.getNewScholars(searched).then(response => {
      console.log(response.data);
      uc.scholars = response.data;
    }, err => {
      console.log(err);
    });    
  }

  $scope.$watch('uc.scholar_lastname', debounce(function() {
    getNewScholars({ searched: uc.scholar_lastname });
  }, 500), true);

}]);

app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});