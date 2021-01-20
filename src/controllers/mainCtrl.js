'use strict';
/**
 * @ngdoc function
 * @name psmsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the psmsApp
 */
var app = angular.module('psmsApp');
app.controller('mainCtrl',['$scope', '$rootScope', '$mdSidenav', '$mdDialog', '$location', '$timeout', function ($scope, $rootScope, $mdSidenav, $mdDialog, $location, $timeout) {

    $scope.toggleSidenav = buildToggler('left');


    $scope.toppings = [{name:'Admin'},{name:'User'}];

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.navigateTo = function(destination){
      $location.path(destination);
      $timeout($scope.toggleSidenav(), 1000);
    }

}]);