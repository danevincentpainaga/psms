'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('dashboardCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'swalert', 'dashboardApiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, swalert, dashboardApiService) {

  var dc = this;

  
  dashboardApiService.newScholarsCount().then(response => {
  	console.log(response.data);
  	$scope.labels = response.data.municipalities;
  	$scope.undergraduate = response.data.scholars_count;
   	$scope.undergraduate_series = ['NEW', 'OLD'];
  	$scope.options = { legend: { display: true } };

  }, err => {
  	console.log(err);
  })


  dashboardApiService.oldScholarsCount().then(response => {
  	console.log(response.data);
  	$scope.labels = response.data.municipalities;
  	$scope.masteral_doctorate = response.data.scholars_count;
   	$scope.masteral_doctorate_series = ['NEW', 'OLD'];
  	$scope.options = { legend: { display: true } };

  }, err => {
  	console.log(err);
  })

}]);
