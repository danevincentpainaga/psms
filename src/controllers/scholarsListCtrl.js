'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:scholarsListCtrl
 * @description
 * # scholarsListCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('scholarsListCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', '$mdSidenav', 'schoolApiService', 'addressApiService', 'scholarApiService', 'municipalitiesApiService', 'debounce', 'moment', 'exportScholars',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $mdSidenav, schoolApiService, addressApiService, scholarApiService, municipalitiesApiService, debounce, moment, exportScholars) {

  var sc = this;

  sc.status = "Status";
  sc.contract_status = "Contract status";
  sc.degree = "Degree";
  sc.municipality = "Municipality";


  $scope.$watch('sc.scholar_lastname', debounce(function() {

    sc.scholars_loaded = false;
    getScholars();

  }, 500), true);
  
  sc.edit = function(scholarDetails){
    sc.scholar_to_edit = scholarDetails;
    $mdSidenav('right').toggle();
  }

  sc.selectedStatus = function(selected){
    sc.scholars_loaded = false;
    sc.selected_status = selected == 'Status'? undefined : selected;
    getScholars();
  }

  sc.selectedContractStatus = function(selected){
    sc.scholars_loaded = false;
    sc.selected_contract_status = selected == 'Contract status'? undefined : selected;
    getScholars();
  }

  sc.selectedDegree = function(selected){
    sc.scholars_loaded = false;
    sc.selected_degree = selected == 'Degree'? undefined : selected;
    getScholars();
  }

  sc.selectedMunicipality = function(selected){
    sc.scholars_loaded = false;
    sc.selected_municipality = selected;
    getScholars();
  }

  sc.exportNormal = function(){
    exportScholars.exportNormal(sc.scholars);
  }

  sc.exportMasterlist = function(){
    exportScholars.exportMasterlist(sc.scholars);
  }

  function getScholars(){

     let searched = { 
        searched_name: sc.scholar_lastname,
        scholar_status: sc.selected_status,
        contract_status: sc.selected_contract_status,
        degree: sc.selected_degree,
        municipality: sc.selected_municipality,
    };

     scholarApiService.getScholars(searched).then(response => {
      console.log(response.data);
      sc.pagination_data = response.data;
      sc.scholars = response.data.data;
      sc.scholars_loaded = true;
      sc.hide_spinner = true;
    }, err => {
      console.log(err);
    });    
  }

  function getMunicipalities(){
    municipalitiesApiService.getMunicipalities()
      .then(response=>{
        sc.municipalities = response.data;
      }, err=> {
        console.log(err);
      });
  }

  // function getDegrees(){
  //   scholarApiService.getDegrees()
  //     .then(response=>{
  //       sc.access_degree = response.data;
  //     }, err=> {
  //       console.log(err);
  //     });
  // }

  // function checkMunicipality(municipality, municipalities, scholar){
  //     switch(municipality){
  //       case 'ANINI-Y':
  //               municipalities['ANINI-Y'].push(scholar);
  //               break;
  //       case 'TOBIAS FORNIER':
  //               municipalities['TOBIAS FORNIER'].push(scholar);
  //               break;
  //       case 'HAMTIC':
  //               municipalities['HAMTIC'].push(scholar);
  //               break;
  //       case 'SAN JOSE':
  //               municipalities['SAN JOSE'].push(scholar);
  //               break;
  //       case 'SIBALOM':
  //               municipalities['SIBALOM'].push(scholar);
  //               break;
  //       case 'SAN REMEGIO':
  //               municipalities['SAN REMEGIO'].push(scholar);
  //               break;
  //       case 'BELISON':
  //               municipalities['BELISON'].push(scholar);
  //               break;
  //       case 'PATNONGON':
  //               municipalities['PATNONGON'].push(scholar);
  //               break;
  //       case 'BUGASONG':
  //               municipalities['BUGASONG'].push(scholar);
  //               break;
  //       case 'VALDERRAMA':
  //               municipalities['VALDERRAMA'].push(scholar);
  //               break;
  //       case 'LAUA-AN':
  //               municipalities['LAUA-AN'].push(scholar);
  //               break;
  //       case 'BARBAZA':
  //               municipalities['BARBAZA'].push(scholar);
  //               break;
  //       case 'TIBIAO':
  //               municipalities['TIBIAO'].push(scholar);
  //               break;
  //       case 'CULASI':
  //               municipalities['CULASI'].push(scholar);
  //               break;
  //       case 'SEBASTE':
  //               municipalities['SEBASTE'].push(scholar);
  //               break;
  //       case 'PANDAN':
  //               municipalities['PANDAN'].push(scholar);
  //               break;
  //       case 'LIBERTAD':
  //               municipalities['LIBERTAD'].push(scholar);
  //               break;
  //       case 'CALUYA':
  //               municipalities['CALUYA'].push(scholar);
  //               break;
  //     }      

  // }

  // getDegrees();
  getMunicipalities();

}]);

