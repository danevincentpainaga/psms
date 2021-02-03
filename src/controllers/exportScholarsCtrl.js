'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:scholarsListCtrl
 * @description
 * # scholarsListCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('exportScholarsCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'municipalitiesApiService', 'debounce', 'moment', 'exportScholars',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, municipalitiesApiService, debounce, moment, exportScholars) {

  var ex = this;

  ex.semester_list = [{semester: "1st Semester"}, {semester: "2nd Semester"}, {semester: "3rd Semester"}, {semester: "4th Semester"}];

  $scope.$watchGroup(['ex.scholar_lastname', 'ex.age', 'ex.address', 'ex.course_section', 'ex.student_id_number', 'ex.academic_year'], debounce(function() {

    ex.scholars_loaded = false;
    getScholarsToExport();

  }, 500), true);

  $scope.$watchGroup(['ex.gender', 'ex.scholar_status', 'ex.contract_status', 'ex.municipality', 'ex.degree', 'ex.school', 'ex.year_level', 'ex.semester', 'ex.IP'], function(){

    ex.scholars_loaded = false;
    getScholarsToExport();

  }, true); 


  ex.exportNormal = function(){
    ex.show_spinner = true;
    exportScholars.exportNormal(ex.scholars, ex);
  }

  ex.exportMasterlist = function(){
    exportScholars.exportMasterlist(ex.scholars, ex);
  }

  function getScholarsToExport(){

     let searched = { 
        searched_name: ex.scholar_lastname,
        age: ex.age,
        gender: ex.gender,
        scholar_status: ex.scholar_status,
        contract_status: ex.contract_status,
        address: ex.address,
        municipality: ex.municipality,
        degree: ex.degree,
        course_section: ex.course_section,
        schoolId: ex.school,
        student_id_number: ex.student_id_number,
        year_level: ex.year_level,
        semester: ex.semester,
        academic_year: ex.academic_year,
        IP: ex.IP,
    };

     scholarApiService.getScholarsToExport(searched).then(response => {
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

  function getListOfSchool(){
    schoolApiService.getListOfSchool()
      .then(response=>{
        ex.schools = response.data;
      }, err=> {
        console.log(err);
      });
  }

  getListOfSchool();
  getMunicipalities();
  getScholarsToExport();

}]);

