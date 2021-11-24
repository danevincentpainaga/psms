'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:renewScholarsCtrl
 * @description
 * # renewScholarsCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp').controller('renewScholarsCtrl',
    [
        '$scope',
        'debounce',
        'scholarApiService',
        'academicContractDetails',
    function (
        $scope,
        debounce,
        scholarApiService,
        academicContractDetails) {

    var rc = this;

    $scope.$watch('rc.scholar_lastname', debounce(function(n, o) {
        if(n){
            getNotRenewedScholar(n);
        }
        else{
            rc.scholars = [];
        }
    }, 500), true);

    function getNotRenewedScholar(searched){
        rc.searching = true;
        scholarApiService.getNotRenewedScholar({ searched_name: searched, degree: rc.degree }).then(response => {
            console.log(response);
            rc.scholars = response.data.data;
            rc.searching = false;
        }, err => {
            console.log(err);
        });
    }

    function hasSemester(){
        rc.semester = academicContractDetails.academic_year_semester.semester;
        rc.academic_year = academicContractDetails.academic_year_semester.academic_year;
      }
  
    hasSemester();

}]);