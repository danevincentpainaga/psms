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
  dc.undergraduate_total = 0;
  dc.masters_total = 0;
  dc.doctorate_total = 0;
  
  dc.datasetOverride = [{
    backgroundColor: "rgba(71,205,71, 0.58)",
    pointBackgroundColor: "rgba(159,204,0, 1)",
    pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
    borderColor: "#47cd47",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "rgba(159,204,0, 1)",
    fill: false
 }, {
    backgroundColor: "rgba(15,147,255, 0.43)",
    pointBackgroundColor: "rgba(159,204,0, 1)",
    pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
    borderColor: "#0f93ff",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "rgba(159,204,0, 1)",
    fill: false
 }];

  function undergraduateScholarsCount(){
    dashboardApiService.undergraduateScholarsCount().then(response => {
      console.log(response.data);
      dc.undergraduate_labels = response.data.municipalities;
      dc.undergraduate = response.data.scholars_count;
      dc.undergraduate_series = ['NEW', 'OLD'];
      dc.options = { legend: { display: true } };

    }, err => {
      console.log(err);
    })
  }

  function mastersScholarsCount(){
    dashboardApiService.mastersScholarsCount().then(response => {

      console.log(response.data);
      dc.masteral_doctorate_labels = response.data.municipalities;
      dc.masteral_doctorate = response.data.scholars_count;
      dc.masteral_doctorate_series = ['NEW', 'OLD'];
      dc.options = { legend: { display: true } };

    }, err => {
      console.log(err);
    })
  }

  function getApprovedScholarsCount(){
      dashboardApiService.getApprovedScholarsCount().then(response => {
      dc.undergraduate_total = response.data.undergraduate;
      dc.masters_total = response.data.masters;
      dc.doctorate_total = response.data.doctorate;
      console.log(response.data);

    }, err => {
      console.log(err);
    })    
  }

  mastersScholarsCount();
  undergraduateScholarsCount();
  getApprovedScholarsCount();

}]);
