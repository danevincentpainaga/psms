'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addMastersDoctorateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert', 'addScholarsService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, academicContractDetails, debounce, moment, swalert, addScholarsService) {

  var md = this;
  md.list_of_schools = [];
  md.degree = "";

  $scope.$watch('md.scholar_lastname', debounce(function() {
    md.scholars_loaded = false;
    getNewMastersDoctorateScholars({ searched: md.scholar_lastname });
  }, 500), true);

  md.clear = function(){
    md.degree = "";
    addScholarsService.clearInputs();
  }  

  md.saveNewMasterDoctorateDetails = function(){

    if (
          md.firstname && md.lastname && md.middlename && md.addressId && md.date_of_birth
          && md.age && md.gender && md.schoolId && md.course_section && md.year_level && md.student_id_number
          && md.IP && academicContractDetails.ascId && md.search_flastname 
          && md.f_firstname && md.f_middlename && md.search_mlastname && md.m_firstname && md.m_middlename
      ) {
        let scholar_details = {
          firstname: md.firstname.toUpperCase(),
          lastname: md.lastname.toUpperCase(),  
          middlename: md.middlename.toUpperCase(),
          addressId: md.addressId,
          date_of_birth: md.date_of_birth,
          age: md.age,
          gender: md.gender,
          schoolId: md.schoolId,
          course_section: md.course_section.toUpperCase(),
          year_level: md.year_level,
          student_id_number: md.student_id_number,
          IP: md.IP,
          fatherId: md.fatherId,
          motherId: md.motherId,
          degree: md.degree,
          asc_id: academicContractDetails.ascId,
          father:{ f_firstname: md.f_firstname.toUpperCase(), f_lastname: md.search_flastname.toUpperCase(), f_middlename: md.f_middlename.toUpperCase() },
          mother:{ m_firstname: md.m_firstname.toUpperCase(), m_lastname: md.search_mlastname.toUpperCase(), m_middlename: md.m_middlename.toUpperCase() },
        }
            
        console.log(scholar_details);
        saveNewScholarDetails(scholar_details);    

    }
    else{
      swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
    }
  }

  md.selectedDegree = function(){
    md.degree_has_selected = md.degree ?  true : false;
    console.log(md.degree_has_selected);
  }

  md.selectedFatherDetailsChange = function(fdetails){
    if (md.father) {
      md.fatherId = fdetails.father_details_id;
      md.f_firstname = fdetails.f_firstname;
      md.f_middlename = fdetails.f_middlename;
    }
    else{
      md.f_firstname = "";
      md.f_middlename = "";
    }
  }

  md.selectedMotherDetailsChange = function(mdetails){
    if (md.mother) {
      md.motherId = mdetails.mother_details_id;
      md.m_firstname = mdetails.m_firstname;
      md.m_middlename = mdetails.m_middlename;
    }
    else{
      md.m_firstname = "";
      md.m_middlename = "";
    }
  }


  md.selectedSchoolChange = function(school){
    if (school) {
      md.schoolId = school.school_id;
    }
    else{
      md.schoolId = null;
      md.search_school = "";
    }
  }

  md.selectedAddressChange = function(address){
    if (address) {
      md.addressId = address.address_id;
    }
    else{
      md.addressId = null;
      md.search_address = "";
    }
  }

  md.searchSchoolChange = function(searched){
    console.log(searched);
  }

  md.selectedDateOfBirth = function(dateOfBirth){
    md.age = addScholarsService.calcAge(dateOfBirth);
    md.displayedAge = md.age;
  }

  md.schoolSearchQuery = function(searched){
     return addScholarsService.getSearchedSchool(searched);
  }

  md.addressSearchQuery = function(searched){
    return addScholarsService.getAddresses(searched);
  }

  md.motherSearchQuery = function(searched){
    return addScholarsService.getMotherList(searched);
  }

  md.fatherSearchQuery = function(searched){
    return addScholarsService.getFatherList(searched);
  }

  function saveNewScholarDetails(scholarDetails){
     scholarApiService.saveNewScholarDetails(scholarDetails).then(response => {
      md.degree = "";
      md.degree_has_selected = false;
      console.log(response.data);
      addScholarsService.clearInputs();
      swalert.dialogBox('Scholar saved!', 'success', 'Success');
    }, err => {
      console.log(err);
    });
  }

  function getNewMastersDoctorateScholars(searched){
     scholarApiService.getNewMastersDoctorateScholars(searched).then(response => {
      console.log(response.data);
      md.scholars = response.data;
      md.scholars_loaded = true;
    }, err => {
      console.log(err);
    });    
  }

  function hasSemester(){
    if (academicContractDetails && academicContractDetails.contract_state != 'Closed') {
      md.semester = academicContractDetails.academic_year_semester.semester
      md.academic_year = academicContractDetails.academic_year_semester.academic_year;
      md.has_semester = true;
    }
    else{
      md.has_semester = false;
    }
    console.log(academicContractDetails);
  }

  hasSemester();

}]);