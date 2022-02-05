'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:updateSchoolCtrl
 * @description
 * # updateSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('updateSchoolCtrl',
  [
    '$scope',
    '$rootScope',
    '$mdDialog',
    'schoolApiService',
    'swalert',
  function (
    $scope,
    $rootScope,
    $mdDialog,
    schoolApiService,
    swalert) {

  var up = this;

  $scope.$watch('schooldetails', function(o, v){
    if ($scope.schooldetails) {
      up.school_name = $scope.schooldetails.school_name;
      up.has_school_name = true; 
    }
  }, true);

  up.cancelEditing = function(){
    $scope.editing = false;
  }

  up.update = function (answer) {
    if (up.school_name) {
      up.updating = true;
      let new_school_name = { school_id: $scope.schooldetails.school_id, school_name: up.school_name.toUpperCase(), s_province_id: up.province_id };
      updateSchoolDetails(new_school_name);
    }
  };

  function updateSchoolDetails(details){
    schoolApiService.updateSchoolDetails(details).then(response => {
      console.log(response.data);
      up.updating = false;
      swalert.dialogBox('School details updated', 'success', 'Success');
      $scope.$emit('successful_update_emit_from_updateSchoolCtrl');
    }, err => {
      console.log(err);
      up.updating = false;
      swalert.dialogBox(err.data.message, 'error', 'Failed');
    });
  }

}]);