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
        '$mdSidenav',
        'scholarApiService',
        'academicContractDetails',
        'printContract',
        'swalert',
    function (
        $scope,
        debounce,
        $mdSidenav,
        scholarApiService,
        academicContractDetails,
        printContract,
        swalert) {

    var rc = this;

    $scope.$watch('rc.scholar_lastname', debounce(function(n, o) {
        if(n){
            getNotRenewedScholar(n);
        }
        else{
            rc.scholars = [];
        }
    }, 500), true);

    rc.edit = function(scholarDetails){
        rc.scholar_to_edit = scholarDetails;
        $mdSidenav('editScholar').toggle();
    }

    rc.renew = function(scholarDetails){
        console.log(scholarDetails);
        let details = {
            scholar_id: scholarDetails.scholar_id,
            contract_id: academicContractDetails.activated_contract_id,
            last_renewed: academicContractDetails.ascId
        }

        scholarApiService.renewScholar(details).then(response => {
            Object.assign(scholarDetails, { 
                contract_status: 'Pre-Approved',
                academicyear_semester_contract: academicContractDetails.academic_year_semester,
                contract_id: academicContractDetails.activated_contract_id,
                last_renewed: academicContractDetails.ascId
            });
            swalert.dialogBox(response.data.message, 'success', 'Success');
            printContract.print(scholarDetails, rc, academicContractDetails.governor);
            console.log(response);
        }, err => {
            console.log(err);
            swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
    }

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