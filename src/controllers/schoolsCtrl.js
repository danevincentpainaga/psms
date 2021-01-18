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

  var sc = this;

  $scope.$on('successful_update_emit_from_updateSchoolCtrl', function(){
    getListOfSchool();
  });

  $rootScope.$on('successful_add_emit_from_addSchoolCtrl', function(){
    getListOfSchool();
  });

  function getListOfSchool(searched){
     schoolApiService.getListOfSchool(searched).then(response => {
      sc.disable_linear_loader = true;
      console.log(response.data);
      sc.school_list_loaded = true;
      sc.hide_spinner = true;
      sc.list_of_schools = response.data;
    }, err => {
      console.log(err);
    });

  }

  $scope.$watch('sc.searched_school', debounce(function() {

    let schoolName = { searched_school: sc.searched_school };

    sc.school_list_loaded = false;
    getListOfSchool(schoolName);

  }, 500), true);

  sc.showDialog = function (ev) {
    $mdDialog.show({
      controller: 'addSchoolCtrl',
      controllerAs: 'as',
      templateUrl: 'src/views/add_school_dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    }).then(function (answer) {
      sc.status = 'You said the information was "' + answer + '".';
      console.log(sc.status);
    }, function () {
      sc.status = 'You cancelled the dialog.';
      console.log(sc.status);
    });
  };


  sc.edit = function(school_data){
    sc.editing_state = true;
    sc.school_to_update = { school_id: school_data.school_id, school_name: school_data.school_name, s_province_id: school_data.s_province_id };
  }

}]);

app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});