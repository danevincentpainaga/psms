'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addressCtrl
 * @description
 * # addressCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('addressCtrl',['$scope', 'municipalitiesApiService', 'addressApiService', 'debounce', 'swalert', '$mdSidenav',
	function ($scope, municipalitiesApiService, addressApiService, debounce, swalert, $mdSidenav) {

	var ad = this;
	ad.isUpdating = false;

	$scope.$watch('ad.searched_address', debounce(function(){
		ad.searching = true;
		getAdresses(ad.searched_address);
	}, 500), true);

	ad.add = function(){
		ad.isUpdating = false;
		ad.saveUpdateBtnText = 'Save';
		ad.labelText = 'Save';
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.edit = function(selected_address){
		ad.binded_address = selected_address;
		ad.address_id = selected_address.address_id;
		ad.address = selected_address.address;
		ad.municipality = selected_address.municipality;
		ad.isUpdating = true;
		ad.saveUpdateBtnText = 'Update';
		ad.labelText = 'Update';
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.close = function(){
		clearInputs();
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.saveUpdateAddress = function(){

		if (ad.address && ad.municipality) {

			ad.saving_updating = true;

			let address_details = {
				address: ad.address.toUpperCase(),
				municipality: ad.municipality
			};

			if (!ad.isUpdating) {
				storeAddress(address_details);
			}
			else{
				updateAddress(address_details);
			}
		}
	}


	function storeAddress(address_details){
		addressApiService.storeAddress(address_details).then(response => {
			ad.addresses.push(response.data);
			clearInputs();
			ad.saving_updating = false;
			swalert.toastInfo('Address saved.', 'success', 'top-right', 4000);
		}, err => {
			console.log(err);
			swalert.toastInfo(err.data, 'error', 'top-right');
		})
	}

	function updateAddress(address_details){

		Object.assign(address_details, { address_id: ad.address_id });

		addressApiService.updateAddress(address_details).then(response => {
			ad.binded_address.address = response.data.address;
			ad.binded_address.municipality = response.data.municipality;
			clearInputs();
			ad.saving_updating = false;
			swalert.toastInfo('Address updated.', 'success', 'top-right', 4000);
		}, err => {
			console.log(err);
			swalert.toastInfo(err.data, 'error', 'top-right');
		})
	}

	function getMunicipalities(){
		municipalitiesApiService.getMunicipalities()
		  .then(response=>{
		    ad.municipalities = response.data;
		  }, err=> {
		    console.log(err);
		  });
	}

	function getAdresses(searched){
		addressApiService.getAddresses({searched: searched}).then(response=>{
		  ad.addresses = response.data;
		  ad.searching = false;
		  ad.address_list_loaded = true;
		}, err => {
		  console.log(err);
		});
	}

	function clearInputs(){
		ad.binded_address = "";
		ad.address = "";
		ad.municipality = "";
	}

	getMunicipalities();

}]);