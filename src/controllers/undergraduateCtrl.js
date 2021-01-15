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
  uc.status = "Status";
  uc.contract_status = "Contract status";

  uc.selectedStatus = function(selected){
    uc.scholars_loaded = false;
    uc.selected_status = selected == 'Status'? undefined : selected;
    getScholars();
  }

  uc.selectedContractStatus = function(selected){
    uc.scholars_loaded = false;
    uc.selected_contract_status = selected == 'Contract status'? undefined : selected;
    getScholars();
  }

  function getScholars(){

     let searched = { 
        searched_name: uc.scholar_lastname,
        scholar_status: uc.selected_status,
        contract_status: uc.selected_contract_status,
        degree: 'Undergraduate'
    };

    console.log(searched);

     scholarApiService.getScholars(searched).then(response => {
      console.log(response.data);
      uc.scholars = response.data;
      uc.scholars_loaded = true;
      uc.hide_spinner = true;
    }, err => {
      console.log(err);
    });    
  }

  $scope.$watch('uc.scholar_lastname', debounce(function() {

    uc.scholars_loaded = false;
    getScholars();

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