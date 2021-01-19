'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:userAccountsCtrl
 * @description
 * # userAccountsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('userAccountsCtrl', ['$scope', '$rootScope', '$mdDialog', 'usersApiService', 'debounce', 'swalert',
  function ($scope, $rootScope, $mdDialog, usersApiService, debounce, swalert) {

  var u = this;

  $scope.$watch('u.searched_user', debounce(function() {

    u.users_list_loaded = false;
    let searched = { searched: u.searched_user };

    getUserAccounts(searched);

  }, 500), true);


  function getUserAccounts(details){
    usersApiService.getUserAccounts(details).then(response => {
      console.log(response.data);
      u.users_list = response.data;
      u.disable_linear_loader = true;
      u.users_list_loaded = true;
    }, err => {
      console.log(err);
    });
  }

}]);
