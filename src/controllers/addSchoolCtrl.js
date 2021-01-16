'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addSchoolCtrl
 * @description
 * # addSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addSchoolCtrl', ['$scope', '$mdDialog', 'provinceApiService',
  function ($scope, $mdDialog, provinceApiService) {

  var as = this;

  as.addNewSchool =function(){
  
  }

  as.hide = function () {
    $mdDialog.hide();
  };

  as.cancel = function () {
    $mdDialog.cancel();
  };

  as.save = function (answer) {
    $mdDialog.hide(answer);
  };

  as.queryProvince = function(searchedText){
    console.log(searchedText);
    return getProvinces(searchedText);
  }

  function getProvinces(searchedText){
    let searched = { searched_province: searchedText };
    return provinceApiService.getProvinces(searched).then(response => {
      console.log(response.data);
      return response.data;
    }, err => {
      console.log(err);
    });
  }

}]);
