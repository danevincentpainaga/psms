'use strict';
/**
 * @ngdoc function
 * @name psmsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the psmsApp
 */

angular.module('psmsApp')
  .controller('mainCtrl',['$scope', '$rootScope', '$mdSidenav', '$mdDialog', '$cookies', '$location', '$timeout', 'authApiService',
     function ($scope, $rootScope, $mdSidenav, $mdDialog, $cookies, $location, $timeout, authApiService) {

    $scope.toggleSidenav = buildToggler('left');

    $scope.toppings = [{name:'Admin'},{name:'User'}];

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.navigateTo = function(destination){
      $location.path(destination);
      $timeout($scope.toggleSidenav(), 1200);
    }

    $scope.logout = function(){
      $rootScope.loggged_out = true;
      authApiService.logout().then(response => {
        $cookies.remove('auth');
        $location.path('/');
      }, err =>{
        console.log(err);
      })
    }


}]);