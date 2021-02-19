'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:scholarsListCtrl
 * @description
 * # scholarsListCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('scholarsListCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', '$mdSidenav', 'schoolApiService', 'addressApiService', 'scholarApiService', 'municipalitiesApiService', 'debounce', 'moment',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $mdSidenav, schoolApiService, addressApiService, scholarApiService, municipalitiesApiService, debounce, moment) {

  var sc = this;

  sc.status = "Status";
  sc.contract_status = "Contract status";
  sc.degree = "Degree";
  sc.municipality = "Municipality";


  $scope.$watch('sc.scholar_lastname', debounce(function() {

    sc.scholars_loaded = false;
    getScholars();

  }, 500), true);

  sc.print = function(scholarDetails, idx){
    sc.selectedIndex = idx;
    print(scholarDetails);
  }

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

  function print(scholarDetails){

    let docDefinition = {
        content: [
          {text: 'NAME: '+scholarDetails.firstname.toUpperCase()+" "+scholarDetails.lastname.toUpperCase()+", "+scholarDetails.middlename.toUpperCase()},
        ]
      };

    let pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.print({}, window.frames['printPdf']);
    
    pdfDocGenerator.getDataUrl((dataUrl) => {
      $timeout(()=>{ sc.selectedIndex = undefined }, 1000);
    });
  }

  getMunicipalities();

}]);

