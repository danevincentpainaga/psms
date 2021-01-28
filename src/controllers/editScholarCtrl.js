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
    	ec.search_address = n.address.address;
    	ec.search_school = n.school.school_name;
    	ec.course_section = n.course_section;
    	ec.search_flastname = n.father_details.lastname;
    	ec.f_firstname = n.father_details.firstname;
    	ec.f_middlename = n.father_details.middlename;
    	ec.search_mlastname = n.mother_details.lastname;
    	ec.m_firstname = n.mother_details.firstname;
    	ec.m_middlename = n.mother_details.middlename;
      ec.degree = n.degree;

		  $mdSidenav('right').toggle();
    }
  }, true);

  $scope.$watch('ec.date_of_birth', function(n, o){
    ec.age = addScholarsService.calcAge(n);
    ec.displayedAge = ec.age;
  }, true);  

  ec.updateScholarPrimaryDetails = function(){

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

  ec.updateScholarParentsDetails = function(){

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
