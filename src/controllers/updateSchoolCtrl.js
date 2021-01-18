'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:updateSchoolCtrl
 * @description
 * # updateSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('updateSchoolCtrl', ['$scope', '$rootScope', '$mdDialog', 'provinceApiService', 'schoolApiService', 'swalert',
  function ($scope, $rootScope, $mdDialog, provinceApiService, schoolApiService, swalert) {

  var up = this;

  $scope.$watch('schooldetails', function(o, v){
    if ($scope.schooldetails) {

      up.school_name = $scope.schooldetails.school_name;

    }
  }, true);

  up.cancelEditing = function(){
    $scope.editing = false;
  }

  up.update = function (answer) {
    if (up.school_name && up.province_id) {
      up.updating = true;
      let new_school_name = { school_id: $scope.schooldetails.school_id, school_name: up.school_name.toUpperCase(), s_province_id: up.province_id };
      updateSchoolDetails(new_school_name);
    }

  };

  up.selectedProvinceChange = function(){
    up.province_id = up.selected_province.province_id;
  }

  function getProvinces(){
    provinceApiService.getProvinces().then(response => {
      console.log(response.data);
      up.provinces = response.data;
      up.provinces_loaded = true;
      selectProvince();
    }, err => {
      console.log(err);
    });
  }

  function updateSchoolDetails(details){
    schoolApiService.updateSchoolDetails(details).then(response => {
      console.log(response.data);
      up.updating = true;
      swalert.successAlert("Successful!");
      $scope.$emit('successful_update_emit_from_updateSchoolCtrl');
    }, err => {
      console.log(err);
    });
  }

  function selectProvince(){
    if ($scope.schooldetails) {
      up.selected_province= up.provinces.find((province) => {
        return province.province_id == $scope.schooldetails.s_province_id;
      });
      up.province_id = up.selected_province.province_id;
    }
  }

  getProvinces();


}]);
