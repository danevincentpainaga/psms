'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:contractCtrl
 * @description
 * # contractCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('contractCtrl',[
    '$scope',
    'academicSemesterYearApiService',
    'academicContractService',
    'debounce',
    'moment',
    'swalert',
    '$mdSidenav',
    '$mdDialog',
    '$filter',
    function (
      $scope,
      academicSemesterYearApiService,
      academicContractService,
      debounce,
      moment,
      swalert,
      $mdSidenav,
      $mdDialog,
      $filter) {

    var c = this;

    c.buttonText = "ADD";
    c.labelText = "Add";

    c.semester_list = [{semester: "1st Semester"}, {semester: "2nd Semester"}, {semester: "3rd Semester"}];

    $scope.$watch('c.academic_year_from', function(n, o){
      if (n && n.length === 4) {
        let fromDate = new Date(n).getFullYear();
        let yearNow = new Date().getFullYear();
        if (fromDate > yearNow || fromDate < yearNow-1) {
          c.invalid_year = true;
        }
        else{
          c.invalid_year = false;
          c.academic_year_to = fromDate+1;
          c.display_academic_year = fromDate+1;
        }
      }
      else{
        c.display_academic_year = "";
        c.academic_year_to = "";
      }
    });

    c.saveOrUpdateAcademicYearList = function(){
      if (c.semester && c.academic_year_from && c.academic_year_to && c.undergraduate_amount && c.masteral_doctorate_amount){
        $mdDialog.show({
          contentElement: '#confirmPasswordDialog',
          parent: angular.element(document.body)
        });
        c.func = c.buttonText == 'ADD'? c.functions.storeAcademicYearList : c.functions.updateAcademicYearList;
      }
    }

    c.edit = function(selected){
      let ay = selected.academic_year.split('-');
      c.asc_id = selected.asc_id;
      c.semester = selected.semester;
      c.academic_year_from = ay[0];
      c.academic_year_to = ay[1];
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
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.ascId = selected.asc_id;
      c.func = c.functions.setContract;
    }

    c.closeContract = function(){
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.func = c.functions.closeContract;
    }

    c.openContract = function(){
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.func = c.functions.openContract;
    }

    c.close = function(){
      $mdSidenav('addUpdateContract').toggle();
      c.add_update_contract.$setPristine();
      c.add_update_contract.$setUntouched();
      clearInputs();
    }

    // c.updateContract = function(){
    //   $mdDialog.show({
    //     contentElement: '#confirmPasswordDialog',
    //     parent: angular.element(document.body)
    //   });
    // }

    c.confirm = function(){
      console.log(c.password);
    }

    // c.closeDialog = function(){
    //   $mdDialog.hide();
    // }

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

    // function storeAcademicYearList(details){
    //    academicSemesterYearApiService.storeAcademicYearList(details).then(response => {
    //     clearInputs()
    //     console.log(response.data);
    //     getAcademicYearList();
    //     swalert.dialogBox(response.data.message, 'success', 'Success');
    //   }, err => {
    //     console.log(err);
    //     swalert.dialogBox(err.data.message, 'error', 'Failed');
    //   });
    // }

    // function updateAcademicYearList(details){
    //    academicSemesterYearApiService.updateAcademicYearList({ 
    //     asc_id: c.asc_id,
    //     semester: c.semester,
    //     academic_year: c.academic_year,
    //     undergraduate_amount: c.undergraduate_amount,
    //     masteral_doctorate_amount: c.masteral_doctorate_amount
    //    })
    //    .then(response => {
    //     console.log(response.data);
    //     getAcademicYearList();
    //     swalert.toastInfo(response.data.message, 'success', 'top', 4000);
    //   }, err => {
    //     console.log(err);
    //     swalert.toastInfo(err.data.message, 'error', 'top');
    //   });
    // }

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

    c.functions = {
      storeAcademicYearList: function(){
        academicSemesterYearApiService.storeAcademicYearList({
            semester: c.semester,
            academic_year: c.academic_year_from+'-'+c.academic_year_to,
            undergraduate_amount: c.undergraduate_amount,
            masteral_doctorate_amount: c.masteral_doctorate_amount
          })
          .then(response => {
            clearInputs();
            console.log(response.data);
            clearRequired();
            getAcademicYearList();
            swalert.dialogBox(response.data.message, 'success', 'Success');
          }, err => {
            console.log(err);
            swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
      },
      updateAcademicYearList: function(){
         academicSemesterYearApiService.updateAcademicYearList({ 
          asc_id: c.asc_id,
          semester: c.semester,
          academic_year: c.academic_year_from+'-'+c.academic_year_to,
          undergraduate_amount: c.undergraduate_amount,
          masteral_doctorate_amount: c.masteral_doctorate_amount
         })
         .then(response => {
            console.log(response.data);
            getAcademicYearList();
            swalert.toastInfo(response.data.message, 'success', 'top', 4000);
        }, err => {
          console.log(err);
          swalert.toastInfo(err.data.message, 'error', 'top');
        });
      },
      closeContract: function(){
         academicContractService.closeContract().then(response => {
          c.showOpenContractBtn = true;
          getAcademicYearList();
          swalert.toastInfo(response.data.message, 'success', 'top', 4000);
        }, err => {
          swalert.toastInfo(err.data.message, 'error', 'top');
        });
      },
      setContract: function(){
        academicContractService.setContract({ascId: c.ascId}).then(response => {
          console.log(response.data);
          c.showOpenContractBtn = false;
          getAcademicContractDetails();
          getAcademicYearList();
          swalert.dialogBox(response.data.message, 'success', 'Success');
        }, err => {
          console.log(err);
          swalert.dialogBox(err.data.message, 'error', 'Failed');
        });     
      },
      openContract: function(){
        academicContractService.openContract().then(response => {
          c.showOpenContractBtn = false;
          getAcademicYearList();
          swalert.toastInfo(response.data.message, 'success', 'top', 4000);
        }, err => {
          swalert.toastInfo(err.data.message, 'error', 'top');
        });
      },
      // updateOrSave: function(){
        // c.buttonText == 'ADD'? storeAcademicYearList({ semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount }) : updateAcademicYearList({ asc_id: c.asc_id, semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount });
      // }
    }
    // function setContract(details){
    //    academicContractService.setContract(details).then(response => {
    //     console.log(response.data);
    //     getAcademicContractDetails();
    //     getAcademicYearList();
    //     swalert.dialogBox(response.data.message, 'success', 'Success');
    //   }, err => {
    //     console.log(err);
    //     swalert.dialogBox(err.data.message, 'error', 'Failed');
    //   });
    // } 

    // function closeContract(){
    //   debugger;
    //    academicContractService.closeContract().then(response => {
    //     c.showOpenContractBtn = true;
    //     getAcademicYearList();
    //     swalert.dialogBox(response.data.message, 'success', 'Success');
    //   }, err => {
    //     console.log(err);
    //     swalert.dialogBox(err.data.message, 'error', 'Failed');
    //   });
    // } 

    // function openContract(){
    //    academicContractService.openContract().then(response => {
    //     c.showOpenContractBtn = false;
    //     getAcademicYearList();
    //     swalert.dialogBox(response.data.message, 'success', 'Success');
    //   }, err => {
    //     swalert.dialogBox(err.data.message, 'error', 'Failed');
    //   });
    // } 

    function clearInputs(){
      c.asc_id = "";
      c.semester = "";
      c.academic_year_from ="";
      c.academic_year_to ="";
      c.undergraduate_amount = "";
      c.masteral_doctorate_amount = "";
    }

    // function updateOrSave(){
    //   c.buttonText == 'ADD'? storeAcademicYearList({ semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount }) : updateAcademicYearList({ asc_id: c.asc_id, semester: c.semester, academic_year: c.academic_year, undergraduate_amount: c.undergraduate_amount, masteral_doctorate_amount: c.masteral_doctorate_amount });
    // }

    function checkContractState(contract_state){
      c.showOpenContractBtn = contract_state == 'Open'? false : true;
    }

    function clearRequired(){
      c.add_update_contract.$setPristine();
      c.add_update_contract.$setUntouched();
    }

    // function showPrompt(selected) {
    //   var confirm = $mdDialog.prompt()
    //     .title('Set as contract?')
    //     .textContent('Confirm your password to update.')
    //     .placeholder('password')
    //     .ariaLabel('password')
    //     .targetEvent(selected)
    //     .required(true)
    //     .ok('Confirm')
    //     .cancel('Cancel');

    //   $mdDialog.show(confirm).then(function (password) {
    //     c.show_spinner = true;
    //     confirmPassword({password: password}, selected);
    //   }, function(err){
    //     console.log(err);
    //   });
    // }

    // function confirmPassword(password, selected) {
    //   academicContractService.confirmPassword(password).then(response => {
    //     console.log(response);
    //     c.show_spinner = false;
    //     swalert.confirm({ ascId: selected.asc_id }, setContract, 'Set as Contract?', 'plesase review details', 'info', 500, c);
    //   }, err =>{
    //     console.log(err);
    //     c.show_spinner = false;
    //     swalert.dialogBox(err.data.errors.message, 'error', 'Failed!');
    //   });
    // }

    getAcademicYearList();
    getAcademicContractDetails();

}]);