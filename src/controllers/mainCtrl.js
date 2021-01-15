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

    $scope.toggleSidenav = buildToggler('left');

    $scope.toppings = [{name:'Admin'},{name:'User'}]

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

}]);


// Not yet implemented
app.directive('addDobSlashes', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, element, attr, ctrl) {
      var isDelete = false;
      element.on('keydown', function(e){
        isDelete = e.keyCode === 8; // if we hit delete
      });
      // store regex patterns
      var mmRegEx = /^(0?[23456789]|01|10|12)$/;
      var mmDDRegEx = /^(0?[23456789]|01|10|12|1)[\/.](0[1-9]|[12][0-9]|3[01])$/;

      function inputValue(val) {
        if (isDelete) {
          return val;
        }

        if (val) {
          //first only allow digits and slashes
          val = val.replace(/[^0-9\/]/g, '');

          // prevent duplicate
          if (val[val.length - 1] === '/' && val.length - 2 >= 0 && val[val.length - 2] === '/') {
            val = val.slice(0, -1);
          }
          // test against or mm or mm/dd regex patterns
          // automatically add slashes
          if (mmRegEx.test(val)) {
            val += '/';
          } else if (mmDDRegEx.test(val)) {
            val += '/';
          }
          ctrl.$setViewValue(val);
          ctrl.$render();
          return val;
        } else {
          return undefined;
        }
      }
      ctrl.$parsers.push(inputValue);
    }
  };
});