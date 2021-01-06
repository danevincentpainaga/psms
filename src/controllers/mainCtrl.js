'use strict';
/**
 * @ngdoc function
 * @name psmsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the psmsApp
 */
var app = angular.module('psmsApp');
app.controller('mainCtrl',['$scope', '$rootScope', '$mdSidenav', '$mdDialog', function ($scope, $rootScope, $mdSidenav, $mdDialog) {

    $scope.toggleSidenav = buildToggler('closeEventsDisabled');

    $scope.toppings = [{name:'Admin'},{name:'User'}]


  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'src/views/dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };


  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

}]);

