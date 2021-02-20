'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:schoolsCtrl
 * @description
 * # schoolsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('schoolsCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'debounce', 'moment', '$mdDialog',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, debounce, moment, $mdDialog) {

  var s = this;

  $scope.$on('successful_update_emit_from_updateSchoolCtrl', function(){
    getListOfSchool();
  });

  $rootScope.$on('successful_add_emit_from_addSchoolCtrl', function(){
    getListOfSchool();
  });

  function getListOfSchool(searched){
     schoolApiService.getListOfSchool(searched).then(response => {
      s.disable_linear_loader = true;
      s.school_list_loaded = true;
      s.hide_spinner = true;
      s.list_of_schools = response.data;
    }, err => {
      console.log(err);
    });

  }

  $scope.$watch('s.searched_school', debounce(function() {

    let schoolName = { searched_school: s.searched_school };

    s.school_list_loaded = false;
    getListOfSchool(schoolName);

  }, 500), true);

  s.showDialog = function (ev) {
    $mdDialog.show({
      controller: 'addSchoolCtrl',
      controllerAs: 'as',
      templateUrl: 'src/views/add_school_dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    }).then(function (answer) {
      s.status = 'You said the information was "' + answer + '".';
      console.log(s.status);
    }, function () {
      s.status = 'You cancelled the dialog.';
      console.log(s.status);
    });
  };


  s.edit = function(school_data){
    s.editing_state = true;
    s.school_to_update = { school_id: school_data.school_id, school_name: school_data.school_name, s_province_id: school_data.s_province_id };
  }

}]);