// 'use strict';

// /**
//  * @ngdoc function
//  * @name psmsApp.controller:addUndergraduateCtrl
//  * @description
//  * # addUndergraduateCtrl
//  * Controller of the psmsApp
//  */ 

// var app = angular.module('psmsApp');
// app.controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'loginApiService',
//   function ($scope, $rootScope, $cookies, $window, $location, $timeout, loginApiService) {

//   var ac = this;

//   ac.saveScholar = function(){
//     ac.scholar.degree = "Undergraduate";
//     console.log(ac.scholar);
//   }


// }]);


(function () {
  'use strict';
  angular
      .module('psmsApp')
      .controller('addUndergraduateCtrl', addUndergraduateCtrl);


  function addUndergraduateCtrl ($timeout, $q, $log) {
    var ac = this;

    ac.simulateQuery = false;
    ac.isDisabled    = false;

    // list of `state` value/display objects
    ac.states        = loadAll();
    ac.querySearch   = querySearch;
    ac.selectedItemChange = selectedItemChange;
    ac.searchTextChange   = searchTextChange;

    ac.newState = newState;


  ac.saveScholar = function(){
    ac.scholar.degree = "Undergraduate";
    console.log(ac.scholar);
    console.log(ac.searchText);
  }

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? ac.states.filter(createFilterFor(query)) : ac.states,
          deferred;
      if (ac.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map(function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }
})();