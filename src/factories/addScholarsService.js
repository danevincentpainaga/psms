angular.module('psmsApp')
	.factory('addScholarsService',['schoolApiService', 'addressApiService', 'scholarApiService', function(schoolApiService, addressApiService, scholarApiService){
	  return {
	    getSearchedSchool: function(searched){
			return schoolApiService.getSearchedSchool(searched).then(response=>{
				return response.data;
				}, err => {
				console.log(err);
			});
	    },
	    getAddresses: function(searched){
			return addressApiService.getAddresses({searched: searched}).then(response=>{
			  return response.data;
			}, err => {
			  console.log(err);
			});
	    },
	    getMotherList: function(data){
			return scholarApiService.getMotherList({searched: data}).then(response=>{
			  return response.data;
			}, err => {
			  console.log(err);
			});
	    },
	    getFatherList: function(data){
			return scholarApiService.getFatherList({searched: data}).then(response=>{
			  return response.data;
			}, err => {
			  console.log(err);
			});
	    },
		calcAge: function(dateString) {
		    let birthday = +new Date(dateString);
		    return ~~((Date.now() - birthday) / (31557600000));
	  	},
	    clearInputs: function(ctrl){
		    ctrl.firstname = "";
		    ctrl.lastname = "";
		    ctrl.middlename = "";
		    ctrl.addressId = "";
		    ctrl.address = "";
		    ctrl.school = "";
		    ctrl.date_of_birth = "";
		    ctrl.age = "";
		    ctrl.gender = "";
		    ctrl.schoolId = "";
		    ctrl.course_section = "";
		    ctrl.year_level = "";
		    ctrl.student_id_number = "";
		    ctrl.IP = "";
		    ctrl.fatherId = "";
		    ctrl.motherId = "";
		    ctrl.search_flastname = "";
		    ctrl.f_firstname = "";
		    ctrl.f_middlename = "";
		    ctrl.search_mlastname = "";
		    ctrl.m_firstname = "";
		    ctrl.m_middlename = "";
	    },
	  }
}]);