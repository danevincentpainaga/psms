'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:userAccountsCtrl
 * @description
 * # userAccountsCtrl
 * Controller of the psmsApp
 */ 


angular.module('psmsApp')
  .controller('userAccountsCtrl', ['$scope', 'usersApiService', 'debounce', 'swalert', '$mdSidenav', 'municipalitiesApiService',
    function ($scope, usersApiService, debounce, swalert, $mdSidenav, municipalitiesApiService) {

    var u = this;
    // u.degree_list = [{degree:"All"}, {degree:'Undergraduate'},{degree:'Masters'},{degree:'Doctorate'}];
    u.degree_list = ['Undergraduate', 'Masters', 'Doctorate'];
    u.degree_options = "All";
    u.selected_degree_options = "*";
    u.selected_municipality_options = "*";

    $scope.$watch('u.searched_user', debounce(function() {

      u.users_list_loaded = false;
      let searched = { searched: u.searched_user };
      u.selectedMunicipalities = [];
      u.selectedDegree = [];
      getUserAccounts(searched);

    }, 500), true);

    u.add = function(){
      $mdSidenav('addUpdateUser').toggle();
      getMunicipalities();
    }

    u.save = function(){
      console.log(u.selectedDegree);
    }

    u.close = function(){
      $mdSidenav('addUpdateUser').toggle();
    }

    u.onModelChange = function(searched){
      console.log(searched);
    }

    u.selectedDegreeOptions = function(){
      u.custom_degree = u.selected_degree_options === 'Custom'? true : false;
      console.log(u.selected_degree_options);
    }

    u.selectedMunicipalityOptions = function(){
      u.custom_municipality = u.selected_municipality_options === 'Custom'? true : false;
      console.log(u.selected_municipality_options);
    }

    u.queryMunicipality = function(searched){

      return searched ? u.municipalities.filter(value => value.municipality.toLowerCase().match(searched)) : [];

    }

    u.queryDegree = function(searched){

      return searched ? u.degree_list.filter(value => value.toLowerCase().match(searched)) : [];

    }

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

    function getMunicipalities(){
      municipalitiesApiService.getMunicipalities().then(response => {
        u.municipalities = response.data;
      }, err => {
        console.log(err);
      });
    }

}]);
