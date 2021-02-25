'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('dashboardCtrl', ['$scope', 'dashboardApiService', function ($scope, dashboardApiService) {

  var dc = this;

  dc.undergraduate_total = 0;
  dc.masters_total = 0;
  dc.doctorate_total = 0;

  dc.series = ['NEW', 'OLD'];
  dc.options = { legend: { display: true } };
  
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
      dc.undergraduate_labels = response.data.municipalities;
      dc.undergraduate = response.data.scholars_count;
    }, err => {
      console.log(err);
    })
  }

  function mastersScholarsCount(){
    dashboardApiService.mastersScholarsCount().then(response => {
      dc.masteral_doctorate_labels = response.data.municipalities;
      dc.masteral_doctorate = response.data.scholars_count;
    }, err => {
      console.log(err);
    })
  }

  function getApprovedScholarsCount(){
      dashboardApiService.getApprovedScholarsCount().then(response => {
      dc.undergraduate_total = response.data.undergraduate;
      dc.masters_total = response.data.masters;
      dc.doctorate_total = response.data.doctorate;
    }, err => {
      console.log(err);
    })    
  }

  function getNewOldTotalPerDegree(){
      dashboardApiService.getNewOldTotalPerDegree().then(response => {
      dc.degree_labels = response.data.degree;
      dc.degree = response.data.scholars_count;
    }, err => {
      console.log(err);
    })    
  }

  function getContractStatusTotalPerDegree(){
      dashboardApiService.getContractStatusTotalPerDegree().then(response => {
      dc.contract_status = response.data;
    }, err => {
      console.log(err);
    })    
  }

  getContractStatusTotalPerDegree();
  getNewOldTotalPerDegree();
  mastersScholarsCount();
  undergraduateScholarsCount();
  getApprovedScholarsCount();

}]);
