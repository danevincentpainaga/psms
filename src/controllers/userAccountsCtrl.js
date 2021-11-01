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
    u.user_type_list = ['Admin', 'User'];
    u.degree_list = ['Undergraduate', 'Masters', 'Doctorate'];
    u.status_list = ['Active', 'In-Active'];
    u.degree_options = "All";
    u.selected_degree_options = "*";
    u.selected_municipality_options = "*";
    u.selectedDegree = [];
    u.selectedMunicipalities = ["*"];
    u.selectedDegree = ["*"];

    // showCustomDegreeMunicpality($rootScope.isAdmin);
    getMunicipalities();

    $scope.$watch('u.searched_user', debounce(function() {

      u.users_list_loaded = false;
      let searched = { searched: u.searched_user };
      getUserAccounts(searched);

    }, 500), true);

    u.edit = function(selectedUser){
      console.log(selectedUser);
    //  let bool = selectedUser.user_type === 'User'? false : true;
    //  showCustomDegreeMunicpality(bool);
     $mdSidenav('addUpdateUser').toggle();
    }

    u.add = function(){
      $mdSidenav('addUpdateUser').toggle();
    }

    u.saveUser = function(){

      console.log(u.selectedDegree.length, u.selectedMunicipalities.length);
      if (!u.name && !u.email && !u.password && !u.c_password && !u.user_type && !u.status && !u.year_level && !u.selectedDegree.length <= 0 && !u.selectedMunicipalities.length <= 0) {
        return;
      }

      if (u.c_password !== u.password) {
        u.password_not_match = true;
        return;
      }

      u.isSaving = true;

      let newUser = {
        name: u.name,
        email: u.email,
        password: u.password,
        municipal_access: u.selectedMunicipalities,
        degree_access: u.selectedDegree,
        user_type: u.user_type,
        status: u.status
      }
      console.log(newUser);

      usersApiService.createUsersAccount(newUser).then(response => {
        console.log(response);
        swalert.toastInfo('User saved!', 'success', 'top-right');
        u.isSaving = false;
        clearUserInputs();
        getUserAccounts();
      }, err => {
        console.log(err);
        swalert.toastInfo(err.data.message,  'error', 'top-right');
        u.isSaving = false;
      });

    }

    u.close = function(){
      $mdSidenav('addUpdateUser').toggle();
    }

    u.transform = function(chip){
      return chip.municipality;
    }

    u.transformDegree = function(chip){
     return u.degree_list.indexOf(chip) !== -1 ? chip : null;
    }

    u.selectedDegreeOptions = function(){
      if (u.selected_degree_options === 'Custom') {
        u.selectedDegree = [];
        u.custom_degree = true;   
      }
      else{
        u.selectedDegree = ["*"];
        u.custom_degree = false;
      }
    }

    u.selectedMunicipalityOptions = function(){
      if (u.selected_municipality_options === 'Custom') {
        u.selectedMunicipalities = [];
        u.custom_municipality = true;
      }
      else{
        u.selectedMunicipalities = ["*"];
        u.custom_municipality = false;
      }
    }

    u.queryMunicipality = function(searched){

      return u.municipalities.filter(value => value.municipality.toLowerCase().match(searched));

    }

    u.queryDegree = function(searched){
      return searched ? u.degree_list.filter(value => value.toLowerCase().match(searched)) : [];
    }

    function getUserAccounts(details = ""){
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

    function clearUserInputs(){
      u.name = "";
      u.email = "";
      u.password = "";
      u.c_password = "";
      u.user_type = "";
      u.status = "";
      u.selectedMunicipalities = ["*"];
      u.selectedDegree = ["*"];
      u.addUserForm.$setPristine();
      u.addUserForm.$setUntouched();
    }

}]);
