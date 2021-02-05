'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addSchoolCtrl
 * @description
 * # addSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addSchoolCtrl', ['$scope', '$rootScope', '$mdDialog', 'schoolApiService', 'swalert',
  function ($scope, $rootScope, $mdDialog, schoolApiService, swalert) {

  var as = this;
  as.saveBtnText = 'Save';

  as.cancelEditing = function(){
    $scope.editing = false;
  }

  as.closeDialog = function () {
    $mdDialog.cancel();
  };

  as.save = function (answer) {
    if (as.school_name) {
      as.saveBtnText = 'Saving...';
      as.saving = true;
      let new_school_name = { school_name: as.school_name.toUpperCase() };
      saveSchoolDetails(new_school_name);
    }
  };

  function saveSchoolDetails(details){
    schoolApiService.saveSchoolDetails(details).then(response => {
      console.log(response.data);
      clearInputs();
      as.saveBtnText = 'Save';
      as.saving = false;
      swalert.dialogBox('School saved!', 'success', 'Success');
      $rootScope.$emit('successful_add_emit_from_addSchoolCtrl');
    }, err => {
      console.log(err);
    });
  }

  function clearInputs(){
    as.school_name ="";
    as.selected_province = "";
  }

}]);
