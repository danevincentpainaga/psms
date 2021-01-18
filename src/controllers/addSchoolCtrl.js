'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addSchoolCtrl
 * @description
 * # addSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addSchoolCtrl', ['$scope', '$rootScope', '$mdDialog', 'provinceApiService', 'schoolApiService', 'swalert',
  function ($scope, $rootScope, $mdDialog, provinceApiService, schoolApiService, swalert) {

  var as = this;

  as.cancelEditing = function(){
    $scope.editing = false;
  }

  as.closeDialog = function () {
    $mdDialog.cancel();
  };

  as.save = function (answer) {
    if (as.school_name && as.province_id) {
      as.saving = true;
      let new_school_name = { school_name: as.school_name.toUpperCase(), s_province_id: as.province_id };
      saveSchoolDetails(new_school_name);
    }

  };

  as.selectedProvinceChange = function(){
    as.province_id = as.selected_province.province_id;
  }

  function getProvinces(){
    provinceApiService.getProvinces().then(response => {
      console.log(response.data);
      as.provinces = response.data;
      as.provinces_loaded = true;
    }, err => {
      console.log(err);
    });
  }

  function saveSchoolDetails(details){
    schoolApiService.saveSchoolDetails(details).then(response => {
      console.log(response.data);
      clearInputs();
      swalert.successAlert("Successful!");
      $rootScope.$emit('successful_add_emit_from_addSchoolCtrl');
    }, err => {
      console.log(err);
    });
  }

  function clearInputs(){
    as.school_name ="";
    as.selected_province = "";
  }

  getProvinces();


}]);
