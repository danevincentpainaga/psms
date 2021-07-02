'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:userAccountsCtrl
 * @description
 * # userAccountsCtrl
 * Controller of the psmsApp
 */ 


angular.module('psmsApp')
  .controller('userAccountsCtrl', ['$scope', '$rootScope', 'usersApiService', 'debounce', 'swalert', '$mdSidenav', 'municipalitiesApiService',
    function ($scope, $rootScope, usersApiService, debounce, swalert, $mdSidenav, municipalitiesApiService) {

    var u = this;
    // u.degree_list = [{degree:"All"}, {degree:'Undergraduate'},{degree:'Masters'},{degree:'Doctorate'}];
    u.saveText = 'save';
    u.degree_list = ['Undergraduate', 'Masters', 'Doctorate'];
    u.degree_options = "All";
    u.selected_degree_options = "*";
    u.selected_municipality_options = "*";
    u.selectedDegree = [];
    u.selectedMunicipalities = ['*'];
    u.selectedDegree = ['*'];

    showCustomDegreeMunicpality($rootScope.isAdmin);
    getMunicipalities();

    $scope.$watch('u.searched_user', debounce(function() {

      u.users_list_loaded = false;
      let searched = { searched: u.searched_user };
      // u.selectedMunicipalities = [];
      // u.selectedDegree = [];
      getUserAccounts(searched);

    }, 500), true);

    u.edit = function(selectedUser){
      console.log(selectedUser);
     let bool = selectedUser.user_type === 'User'? false : true;
     showCustomDegreeMunicpality(bool);
     $mdSidenav('addUpdateUser').toggle();
    }

    u.add = function(){
      $mdSidenav('addUpdateUser').toggle();
    }

    u.save = function(){

      console.log(u.selectedDegree.length, u.selectedMunicipalities.length);
      if (!u.name && !u.email && !u.password && !u.c_password && !u.user_type && !u.year_level && !u.selectedDegree.length <= 0 && u.selectedMunicipalities.length <= 0) {
        return;
      }

      if (u.c_password !== u.password) {
        u.password_not_match = true;
        return;
      }

      u.isSaving = true;
      u.saveText = 'saving...';

      let newUser = {
        name: u.name,
        email: u.email,
        password: u.password,
        c_password: u.c_password,
        user_type: u.user_type,
        year_level: u.year_level,
        degree_access: u.selectedDegree,
        municipality_access: u.selectedMunicipalities
      }
      console.log(newUser);
    }

    u.close = function(){
      $mdSidenav('addUpdateUser').toggle();
    }

    u.transform = function(chip){
      return chip.municipality;
    }

    u.selectedDegreeOptions = function(){
      if (u.selected_degree_options === 'Custom') {
        u.selectedDegree = [];
        u.custom_degree = true;   
      }
      else{
        u.selectedDegree = ['*'];
        u.custom_degree = false;
      }
    }

    u.selectedMunicipalityOptions = function(){
      // u.custom_municipality = u.selected_municipality_options === 'Custom'? true : false;
      if (u.selected_municipality_options === 'Custom') {
        u.selectedMunicipalities = [];
        u.custom_municipality = true;
      }
      else{
        u.selectedMunicipalities = ['*'];
        u.custom_municipality = false;
      }
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
        console.log(response);
        u.municipalities = response.data;
      }, err => {
        console.log(err);
      });
    }

    function showCustomDegreeMunicpality(isAdmin) {
      if (!isAdmin) {
        u.degree_access = true;
        u.municipality_access = true;
      }else{
        u.degree_access = false;
        u.municipality_access = false;
      }
    }

}]);
