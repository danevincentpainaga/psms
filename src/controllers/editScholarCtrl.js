'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addSchoolCtrl
 * @description
 * # addSchoolCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('editScholarCtrl', ['$scope', '$rootScope', '$mdDialog', 'addScholarsService', 'swalert', '$mdSidenav',
  function ($scope, $rootScope, $mdDialog, addScholarsService, swalert, $mdSidenav) {

  var ec = this;

  $scope.$watch('scholar', function(n, o){
    if (n) {
    	console.log(n);
      ec.copy = angular.copy(n);
      ec.addressId = n.addressId;
      ec.schoolId = n.schoolId;
    	ec.academic_year = n.academicyear_semester_contract.academic_year;
    	ec.semester = n.academicyear_semester_contract.semester;
    	ec.firstname = n.firstname;
    	ec.lastname = n.lastname;
    	ec.middlename = n.middlename;
    	ec.date_of_birth = n.date_of_birth;
    	ec.gender = n.gender;
    	ec.year_level = n.year_level;
    	ec.student_id_number = n.student_id_number;
    	ec.IP = n.IP;
    	ec.search_address = n.address.barangay_name+' '+n.address.municipality;
    	ec.search_school = n.school.school_name;
    	ec.course_section = n.course_section;
    	ec.search_flastname = n.father.f_lastname;
    	ec.f_firstname = n.father.f_firstname;
    	ec.f_middlename = n.father.f_middlename;
    	ec.search_mlastname = n.mother.m_lastname;
    	ec.m_firstname = n.mother.m_firstname;
    	ec.m_middlename = n.mother.m_middlename;

		  $mdSidenav('right').toggle();
    }
  }, true);

  $scope.$watch('ec.date_of_birth', function(n, o){
    ec.age = addScholarsService.calcAge(n);
    ec.displayedAge = ec.age;
  }, true);  

  ec.updateScholarPrimaryDetails = function(){
    
    if (
          ec.firstname && ec.lastname && ec.middlename && ec.addressId && ec.date_of_birth
          && ec.age && ec.gender && ec.schoolId && ec.course_section && ec.year_level && ec.student_id_number
          && ec.IP
      ) {

      let primary_scholar_details = {
        firstname: ec.firstname.toUpperCase(),
        lastname: ec.lastname.toUpperCase(),
        middlename: ec.middlename.toUpperCase(),
        addressId: ec.addressId,
        date_of_birth: ec.date_of_birth,
        age: ec.age,
        gender: ec.gender,
        schoolId: ec.schoolId,
        course_section: ec.course_section.toUpperCase(),
        year_level: ec.year_level,
        student_id_number: ec.student_id_number.toUpperCase(),
        IP: ec.IP,
      }
      console.log(primary_scholar_details);
    }
  }

  ec.updateScholarParentsDetails = function(){

    // if (ec.search_flastname && ec.f_firstname && ec.f_middlename && ec.search_mlastname && ec.m_firstname && ec.m_middlename) {

    // }

    var parentsDetails ={
      mother_details: validateMother(),
      fatherr_details: validateFather(),
    }

    console.log(parentsDetails);
  }

  function validateMother(){

    var details = {
       motherId: ec.motherId,
       mother:{ m_firstname: ec.m_firstname.toUpperCase(), m_lastname: ec.search_mlastname.toUpperCase(), m_middlename: ec.m_middlename.toUpperCase() },
    }

    return details;
  }

  function validateFather(){

    var details = {
       fatherId: ec.fatherId,
       father:{ f_firstname: ec.f_firstname.toUpperCase(), f_lastname: ec.search_flastname.toUpperCase(), f_middlename: ec.f_middlename.toUpperCase() },
    }

    return details;
  }

  ec.close = function(){
  	$scope.scholar = undefined;
 	  $mdSidenav('right').toggle();
  }

  ec.selectedSchoolChange = function(school){
    ec.schoolId = school ? school.school_id : ec.copy.schoolId;
  }

  ec.selectedAddressChange = function(address){
    ec.addressId = address ? address.address_id : ec.copy.addressId;
  }

  ec.schoolSearchQuery = function(searched){
     return addScholarsService.getSearchedSchool(searched);
  }

  ec.addressSearchQuery = function(searched){
    return addScholarsService.getAddresses(searched);
  }

  ec.motherSearchQuery = function(searched){
    return addScholarsService.getMotherList(searched);
  }

  ec.fatherSearchQuery = function(searched){
    return addScholarsService.getFatherList(searched);
  }

}]);
