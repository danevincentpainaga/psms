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
		let governor = (gov.firstname+' '+gov.initial+'. '+gov.lastname).toUpperCase();
		governorService.updateGovernor({ governor: governor }).then(response => {
			console.log(response);
			gov.updating = false;
			swalert.dialogBox(response.data.message, 'success', 'Success');
		}, err => {
			console.log(err);
		});
	}

	function getGovernoDetails(){
		governorService.getGovernorDetails().then(response=>{
			let gov_details = response.data.governor.split(' ');
			gov.firstname = gov_details[0];
			gov.initial = gov_details[1].replace(/\./g, '');
			gov.lastname = gov_details[2];
			gov.governor_loaded = true;
		}, err=>{
			console.log(err);
		})
	}

	getGovernoDetails();

}]);