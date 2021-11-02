'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:governorCtrl
 * @description
 * # governorCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('governorCtrl', ['governorService', 'swalert', function (governorService, swalert) {

    var gov = this;

	gov.updateGovernor = function(){
		gov.updating = true;
		
		let governor = {
			firstname: gov.firstname,
			initial: gov.initial,
			lastname: gov.lastname,
			suffix: gov.suffix
		}
		
		governorService.updateGovernor(governor).then(response => {
			console.log(response);
			gov.updating = false;
			swalert.dialogBox(response.data.message, 'success', 'Success');
		}, err => {
			console.log(err);
		});
	}

	function getGovernoDetails(){
		governorService.getGovernorDetails().then(response=>{
			let gov_details = JSON.parse(response.data.governor);
			gov.firstname = gov_details.firstname;
			gov.initial = gov_details.initial;
			gov.lastname = gov_details.lastname;
			gov.suffix = gov_details.suffix;
			gov.governor_loaded = true;
		}, err=>{
			console.log(err);
		})
	}

	getGovernoDetails();

}]);