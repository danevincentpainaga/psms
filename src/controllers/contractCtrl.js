'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:contractCtrl
 * @description
 * # contractCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('contractCtrl',['$scope', 'academicSemesterYearApiService', 'academicContractService', 'debounce', 'moment', 'swalert', '$mdSidenav', '$mdDialog',
    function ($scope, academicSemesterYearApiService, academicContractService, debounce, moment, swalert, $mdSidenav, $mdDialog) {

    var c = this;

    c.buttonText = "ADD";
    c.labelText = "Add";

    c.semester_list = [{semester: "1st Semester"}, {semester: "2nd Semester"}, {semester: "3rd Semester"}];

    c.saveOrUpdateAcademicYearList = function(){
      if (c.semester && c.academic_year){
        updateOrSave();
      }
    }

    c.edit = function(selected){
      c.asc_id = selected.asc_id;
      c.semester = selected.semester;
      c.academic_year = selected.academic_year;
      c.undergraduate_amount = selected.undergraduate_amount;
      c.masteral_doctorate_amount = selected.masteral_doctorate_amount;
      c.buttonText = "UPDATE";
      c.labelText = "Update";
      $mdSidenav('addUpdateContract').toggle();
    }

    c.add = function(){
      clearInputs();
      c.buttonText = "ADD";
      c.labelText = "Add";
      $mdSidenav('addUpdateContract').toggle();
    }

    c.setContract = function(selected){
      showPrompt(selected);
    }

    c.closeContract = function(){
      closeContract();
    }

    c.openContract = function(){
      openContract();
    }

    c.close = function(){
      $mdSidenav('addUpdateContract').toggle();
      clearInputs();
    }

    function getAcademicYearList(){
       academicSemesterYearApiService.getAcademicYearList().then(response => {
        c.disable_linear_loader = true;
        console.log(response.data);
        c.school_list_loaded = true;
        c.academic_year_sem = response.data;
      }, err => {
        c.disable_linear_loader = true;
        console.log(err);
      });
    }

    function storeAcademicYearList(details){
       academicSemesterYearApiService.storeAcademicYearList(details).then(response => {
        clearInputs()
        console.log(response.data);
        getAcademicYearList();
        swalert.dialogBox(response.data.message, 'success', 'Success');
      }, err => {
        console.log(err);
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    }

    function updateAcademicYearList(details){
       academicSemesterYearApiService.updateAcademicYearList(details).then(response => {
        console.log(response.data);
        getAcademicYearList();
        swalert.dialogBox(response.data.message, 'success', 'Success');
      }, err => {
        console.log(err);
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    }

    function getAcademicContractDetails(){
       academicContractService.getAcademicContractDetails().then(response => {
          checkContractState(response.data[0].contract_state);
          c.contract_details = response.data;
          c.contract_status = c.contract_details[0].contract_state;
          c.contract_loaded = true;
          c.not_in_progress = true;
          console.log(c.contract_details);
      }, err => {
        console.log(err);
        c.not_in_progress = true;
      });
    } 

    function setContract(details){
       academicContractService.setContract(details).then(response => {
        console.log(response.data);
        getAcademicContractDetails();
        getAcademicYearList();
        swalert.dialogBox(response.data.message, 'success', 'Success');
      }, err => {
        console.log(err);
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    } 

    function closeContract(){
       academicContractService.closeContract().then(response => {
        c.showOpenContractBtn = true;
        getAcademicYearList();
        swalert.dialogBox(response.data.message, 'success', 'Success');
      }, err => {
        console.log(err);
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    } 

    function openContract(){
       academicContractService.openContract().then(response => {
        c.showOpenContractBtn = false;
        getAcademicYearList();
        swalert.dialogBox(response.data.message, 'success', 'Success');
      }, err => {
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    } 

    function clearInputs(){
      c.asc_id = "";
      c.semester = "";
      c.academic_year ="";
      c.undergraduate_amount = "";
      c.masteral_doctorate_amount = "";
    }

    function updateOrSave(){
      c.buttonText == 'ADD'? storeAcademicYearList({ semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount }) : updateAcademicYearList({ asc_id: c.asc_id, semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount });
    }

    function checkContractState(contract_state){
      c.showOpenContractBtn = contract_state == 'Open'? false : true;
    }

    function showPrompt(selected) {
      console.log(selected)
      var confirm = $mdDialog.prompt()
        .title('Set as contract?')
        .textContent('Confirm your password to update.')
        .placeholder('password')
        .ariaLabel('password')
        .targetEvent(selected)
        .required(true)
        .ok('Confirm')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function (password) {
        c.show_spinner = true;
        confirmPassword({password: password}, selected);
      }, function(err){
        console.log(err);
      });
    }

    function confirmPassword(password, selected) {
      academicContractService.confirmPassword(password).then(response => {
        console.log(response);
        c.show_spinner = false;
        swalert.updateInfo({ ascId: selected.asc_id }, setContract);
      }, err =>{
        console.log(err);
        c.show_spinner = false;
        swalert.dialogBox(err.data.errors.message, 'error', 'Failed!');
      });
    }

    getAcademicYearList();
    getAcademicContractDetails();

}]);