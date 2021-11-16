'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:governorCtrl
 * @description
 * # governorCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('governorCtrl', ['$scope', 'governorService', 'swalert', function ($scope, governorService, swalert) {

    var gov = this;
	// gov.sufffixes = ['JR', 'SR', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];

	$scope.$watch('gov.initial', function(n, o){
		if(n){
			gov.initial = gov.initial.replace(/[^A-Z]+/g, '');
			if(gov.initial.length > 1){
				gov.initial = gov.initial.slice(0, 1);
			}
		}
	});

	gov.updateGovernor = function(){
		
		if(!gov.firstname || !gov.initial || !gov.lastname) return;
		gov.updating = true;
		
		let governor = {
			firstname: gov.firstname,
			initial: gov.initial,
			lastname: gov.lastname,
			suffix: gov.suffix? gov.suffix : "",
		}

		debugger;

		governorService.updateGovernor(governor).then(response => {
			console.log(response);
			gov.updating = false;
			gov.enabled = false;
			swalert.dialogBox(response.data.message, 'success', 'Success');
		}, err => {
			console.log(err);
			swalert.dialogBox(err.data.message, 'error', 'Failed');
			gov.updating = false;
			gov.enabled = false;
		});
	}

	gov.enableDisable = function(){
		gov.enabled = gov.enabled ? false : true;
	}

	function getGovernoDetails(){
		governorService.getGovernorDetails().then(response=>{
			if(response.data){
				let gov_details = JSON.parse(response.data.governor);
				gov.firstname = gov_details.firstname;
				gov.initial = gov_details.initial;
				gov.lastname = gov_details.lastname;
				gov.suffix = gov_details.suffix;
				gov.governor_loaded = true;
			}
			gov.governor_loaded = true;
		}, err=>{
			console.log(err);
		})
	}

	getGovernoDetails();

}]);