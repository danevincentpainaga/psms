'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:contractCtrl
 * @description
 * # contractCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('contractCtrl',['$scope', 'academicSemesterYearApiService', 'academicContractService', 'debounce', 'moment', 'swalert', 
  function ($scope, academicSemesterYearApiService, academicContractService, debounce, moment, swalert) {

  var c = this;

  c.buttonText = "ADD";
  c.labelText = "Add";

  c.semester_list = [{semester: "1st Semester"}, {semester: "2nd Semester"}, {semester: "3rd Semester"}, {semester: "4th Semester"}];

  c.saveOrUpdateAcademicYearList = function(){
    if (c.semester && c.academic_year)
      updateOrSave();
  }

  c.edit = function(selected){
    c.asc_id = selected.asc_id;
    c.semester = selected.semester;
    c.academic_year = selected.academic_year;
    c.buttonText = "UPDATE";
    c.labelText = "Update";
  }

  c.setContract = function(selected){
    swalert.updateInfo({ ascId: selected.asc_id }, setContract);
  }

  c.clear = function(){
    clearInputs();
  }

  function getAcademicYearList(){
     academicSemesterYearApiService.getAcademicYearList().then(response => {
      c.disable_linear_loader = true;
      console.log(response.data);
      c.school_list_loaded = true;
      c.hide_spinner = true;
      c.academic_year_sem = response.data;
    }, err => {
      console.log(err);
    });
  }

  function saveAcademicYearList(details, message){
     academicSemesterYearApiService.saveAcademicYearList(details).then(response => {
      clearInputs()
      console.log(response.data);
      getAcademicYearList();
      swalert.successAlert(message);
    }, err => {
      console.log(err);
    });
  }

  function setContract(details){
     academicContractService.setContract(details).then(response => {
      console.log(response.data);
      clearInputs()
      getAcademicYearList();
      swalert.successAlert('Contract Updated!');
    }, err => {
      console.log(err);
    });
  } 


  function clearInputs(){
    c.asc_id = "";
    c.semester = "";
    c.academic_year ="";
    c.buttonText = "ADD";
    c.labelText = "Add";
  }

  function updateOrSave(){
    c.buttonText == 'ADD'? saveAcademicYearList({ semester: c.semester, academic_year: c.academic_year }, 'Saved successfully!') : updateAcademicYearList({ asc_id: c.asc_id, semester: c.semester, academic_year: c.academic_year }, 'Updated successfully!');
  }

  getAcademicYearList();

}]);