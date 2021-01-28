'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:scholarsListCtrl
 * @description
 * # scholarsListCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('exportScholarsCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'municipalitiesApiService', 'debounce', 'moment',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, municipalitiesApiService, debounce, moment) {

  var ex = this;

  ex.status = "Status";
  ex.contract_status = "Contract status";
  ex.degree = "Degree";
  ex.municipality = "Municipality";


  // $scope.$watch('ex.scholar_lastname', debounce(function() {

  //   ex.scholars_loaded = false;
  //   getScholars();

  // }, 500), true);
  

  ex.selectedStatus = function(selected){
    ex.scholars_loaded = false;
    ex.selected_status = selected == 'Status'? undefined : selected;
    getScholars();
  }

  ex.selectedContractStatus = function(selected){
    ex.scholars_loaded = false;
    ex.selected_contract_status = selected == 'Contract status'? undefined : selected;
    getScholars();
  }

  ex.selectedDegree = function(selected){
    ex.scholars_loaded = false;
    ex.selected_degree = selected == 'Degree'? undefined : selected;
    getScholars();
  }

  ex.selectedMunicipality = function(selected){
    ex.scholars_loaded = false;
    ex.selected_municipality = selected;
    getScholars();
  }

  ex.exportNormal = function(){

    var scholar = [];;

    angular.forEach(ex.scholars, function(val, i){

        let new_data  = {
          Lastname: val.lastname,
          Firstname: val.firstname,
          Middlename: val.middlename,
          'Date of Birth': val.date_of_birth,
          Age: val.age,
          Gender: val.gender,
          Address: val.address.barangay_name+" "+val.address.municipality+", ANTIQUE",
          Municipality: val.address.municipality,
          Father: val.father.f_firstname+" "+val.father.f_lastname+", "+val.father.f_middlename,
          Mother: val.mother.m_firstname+" "+val.mother.m_lastname+", "+val.mother.m_middlename,
          School: val.school.school_name,
          'Student ID NO.': val.student_id_number,
          Semester: val.academicyear_semester_contract.semester,
          'Academic year': val.academicyear_semester_contract.academic_year,
          Status: val.scholar_status,
          'Contract status': val.contract_status,
          IP: val.IP
        }
        scholar.push(new_data);
        console.log(scholar);
    });

    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(scholar);

    XLSX.utils.book_append_sheet(wb, ws, 'Scholars list');

    XLSX.writeFile(wb, "Scholars list.xlsx");

    console.log(wb);

  }

  ex.exportMasterlist = function(){

    let municipalities = {
      'ANINI-Y':[],
      'TOBIAS FORNIER':[],
      'HAMTIC':[],
      'SAN JOSE':[],
      'SIBALOM':[],
      'SAN REMEGIO':[],
      'BELISON':[],
      'PATNONGON':[],
      'BUGASONG':[],
      'VALDERRAMA':[],
      'LAUA-AN':[],
      'BARBAZA':[],
      'TIBIAO':[],
      'CULASI':[],
      'SEBASTE':[],
      'PANDAN':[],
      'LIBERTAD':[],
      'CALUYA':[],
    };

    angular.forEach(ex.scholars, function(val, i){

        let scholar = {
          Lastname: val.lastname,
          Firstname: val.firstname,
          Middlename: val.middlename,
          'Date of Birth': val.date_of_birth,
          Age: val.age,
          Gender: val.gender,
          Address: val.address.barangay_name+" "+val.address.municipality+", ANTIQUE",
          Municipality: val.address.municipality,
          Father: val.father.f_firstname+" "+val.father.f_lastname+", "+val.father.f_middlename,
          Mother: val.mother.m_firstname+" "+val.mother.m_lastname+", "+val.mother.m_middlename,
          School: val.school.school_name,
          'Student ID NO.': val.student_id_number,
          'Year level.': val.year_level,
          Semester: val.academicyear_semester_contract.semester,
          'Academic year': val.academicyear_semester_contract.academic_year,
          Status: val.scholar_status,
          'Contract status': val.contract_status,
          IP: val.IP
        }

        checkMunicipality(val.address.municipality, municipalities, scholar);

    });

    var wb = XLSX.utils.book_new();

    Object.keys(municipalities).forEach(function(key){

        var ws = XLSX.utils.json_to_sheet(municipalities[key]);

        XLSX.utils.book_append_sheet(wb, ws, key);

    });

    XLSX.writeFile(wb, "Masterlist.xlsx");

    console.log(wb);
    
  }

  function getScholars(){

     let searched = { 
        searched_name: ex.scholar_lastname,
        scholar_status: ex.selected_status,
        contract_status: ex.selected_contract_status,
        degree: ex.selected_degree,
        municipality: ex.selected_municipality,
    };

     scholarApiService.getScholars(searched).then(response => {
      console.log(response.data);
      ex.scholars = response.data;
      ex.scholars_loaded = true;
      ex.hide_spinner = true;
    }, err => {
      console.log(err);
    });    
  }

  function getMunicipalities(){
    municipalitiesApiService.getMunicipalities()
      .then(response=>{
        ex.municipalities = response.data;
      }, err=> {
        console.log(err);
      });
  }

  function getDegrees(){
    scholarApiService.getDegrees()
      .then(response=>{
        ex.access_degree = response.data;
      }, err=> {
        console.log(err);
      });
  }

  function checkMunicipality(municipality, municipalities, scholar){
      switch(municipality){
        case 'ANINI-Y':
                municipalities['ANINI-Y'].push(scholar);
                break;
        case 'TOBIAS FORNIER':
                municipalities['TOBIAS FORNIER'].push(scholar);
                break;
        case 'HAMTIC':
                municipalities['HAMTIC'].push(scholar);
                break;
        case 'SAN JOSE':
                municipalities['SAN JOSE'].push(scholar);
                break;
        case 'SIBALOM':
                municipalities['SIBALOM'].push(scholar);
                break;
        case 'SAN REMEGIO':
                municipalities['SAN REMEGIO'].push(scholar);
                break;
        case 'BELISON':
                municipalities['BELISON'].push(scholar);
                break;
        case 'PATNONGON':
                municipalities['PATNONGON'].push(scholar);
                break;
        case 'BUGASONG':
                municipalities['BUGASONG'].push(scholar);
                break;
        case 'VALDERRAMA':
                municipalities['VALDERRAMA'].push(scholar);
                break;
        case 'LAUA-AN':
                municipalities['LAUA-AN'].push(scholar);
                break;
        case 'BARBAZA':
                municipalities['BARBAZA'].push(scholar);
                break;
        case 'TIBIAO':
                municipalities['TIBIAO'].push(scholar);
                break;
        case 'CULASI':
                municipalities['CULASI'].push(scholar);
                break;
        case 'SEBASTE':
                municipalities['SEBASTE'].push(scholar);
                break;
        case 'PANDAN':
                municipalities['PANDAN'].push(scholar);
                break;
        case 'LIBERTAD':
                municipalities['LIBERTAD'].push(scholar);
                break;
        case 'CALUYA':
                municipalities['CALUYA'].push(scholar);
                break;
      }      

  }

  getDegrees();
  getMunicipalities();
  getScholars();

}]);

