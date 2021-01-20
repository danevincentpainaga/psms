'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, academicContractDetails, debounce, moment, swalert) {

  var ac = this;
  ac.list_of_schools = [];

  ac.clear = function(){
    clearInputs();
  }  

  ac.saveNewScholarDetails = function(){
    
    ac.degree = "Undergraduate";

    let scholar_details = {
      firstname: ac.firstname.toUpperCase(),
      lastname: ac.lastname.toUpperCase(),  
      middlename: ac.middlename.toUpperCase(),
      addressId: ac.addressId,
      date_of_birth: ac.date_of_birth,
      age: ac.age,
      gender: ac.gender,
      schoolId: ac.schoolId,
      course_section: ac.course_section.toUpperCase(),
      year_level: ac.year_level,
      student_id_number: ac.student_id_number,
      IP: ac.IP,
      fatherId: ac.fatherId,
      motherId: ac.motherId,
      degree: ac.degree,
      scholar_asc_id: academicContractDetails.asc_id,
      father:{ f_firstname: ac.f_firstname.toUpperCase(), f_lastname: ac.search_flastname.toUpperCase(), f_middlename: ac.f_middlename.toUpperCase() },
      mother:{ m_firstname: ac.m_firstname.toUpperCase(), m_lastname: ac.search_mlastname.toUpperCase(), m_middlename: ac.m_middlename.toUpperCase() },
    }

    console.log(scholar_details);
    saveNewScholarDetails(scholar_details);
  }

  ac.selectedFatherDetailsChange = function(fdetails){
    if (ac.father) {
      ac.fatherId = fdetails.father_details_id;
      ac.f_firstname = fdetails.f_firstname;
      ac.f_middlename = fdetails.f_middlename;
    }
    else{
      ac.f_firstname = "";
      ac.f_middlename = "";
    }
    console.log(fdetails);
  }

  ac.selectedMotherDetailsChange = function(mdetails){
    if (ac.mother) {
      ac.motherId = mdetails.mother_details_id;
      ac.m_firstname = mdetails.m_firstname;
      ac.m_middlename = mdetails.m_middlename;
    }
    else{
      ac.m_firstname = "";
      ac.m_middlename = "";
    }
    console.log(mdetails);
  }


  ac.selectedSchoolChange = function(school){
    if (school) {
      ac.schoolId = school.school_id;
    }
    else{
      ac.schoolId = null;
      ac.search_school = "";
    }
    console.log(school);
  }

  ac.selectedAddressChange = function(address){
    if (address) {
      ac.addressId = address.address_id;
    }
    else{
      ac.addressId = null;
      ac.search_address = "";
    }
    console.log(address);
  }

  ac.searchSchoolChange = function(searched){
    console.log(searched);
  }

  ac.selectedDateOfBirth = function(dateOfBirth){
    ac.age = calcAge(dateOfBirth);
    ac.displayedAge = ac.age;
    console.log(ac.age);
  }

  ac.schoolSearchQuery = function(searched){
    return getSearchedSchool(searched);
  }

  ac.addressSearchQuery = function(searched){
    return getAddresses(searched);
  }

  ac.motherSearchQuery = function(searched){
    return getMotherList(searched);
  }

  ac.fatherSearchQuery = function(searched){
    return getFatherList(searched);
  }

  function getSearchedSchool(searched){
    return schoolApiService.getSearchedSchool(searched).then(response=>{
      return response.data;
    }, err => {
      console.log(err);
    });
  }

  function calcAge(dateString) {
    let birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }

  function getAddresses(data){
    return addressApiService.getAddresses({searched: data}).then(response=>{
      console.log(response.data);
      return response.data;
    }, err => {
      console.log(err);
    });
  }

  function getMotherList(data){
    return scholarApiService.getMotherList({searched: data}).then(response=>{
      console.log(response.data);
      return response.data;
    }, err => {
      console.log(err);
    });
  }

  function getFatherList(data){
    return scholarApiService.getFatherList({searched: data}).then(response=>{
      console.log(response.data);
      return response.data;
    }, err => {
      console.log(err);
    });
  }

  function saveNewScholarDetails(scholarDetails){
     scholarApiService.saveNewScholarDetails(scholarDetails).then(response => {
      console.log(response.data);
      clearInputs();
      swalert.successAlert("User successfully saved!");
    }, err => {
      console.log(err);
    });
  }

  function getNewUndergraduateScholars(searched){
     scholarApiService.getNewUndergraduateScholars(searched).then(response => {
      console.log(response.data);
      ac.scholars = response.data;
      ac.scholars_loaded = true;
    }, err => {
      console.log(err);
    });    
  }

  $scope.$watch('ac.scholar_lastname', debounce(function() {
    ac.scholars_loaded = false;
    getNewUndergraduateScholars({ searched: ac.scholar_lastname });
  }, 500), true);

  function clearInputs(){
    ac.firstname = "";
    ac.lastname = "";
    ac.middlename = "";
    ac.addressId = "";
    ac.address = "";
    ac.school = "";
    ac.date_of_birth = "";
    ac.age = "";
    ac.gender = "";
    ac.schoolId = "";
    ac.course_section = "";
    ac.year_level = "";
    ac.student_id_number = "";
    ac.IP = "";
    ac.fatherId = "";
    ac.motherId = "";
    ac.search_flastname = "";
    ac.f_firstname = "";
    ac.f_middlename = "";
    ac.search_mlastname = "";
    ac.m_firstname = "";
    ac.m_middlename = "";
  }

  function hasSemester(){
    if (academicContractDetails) {
      ac.semester = academicContractDetails.semester.semester;
      ac.academic_year = academicContractDetails.academic_year;
      ac.has_semester = true;
    }
    else{
      ac.has_semester = false;
    }
    console.log(academicContractDetails);
  }

  hasSemester();

}]);

app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});