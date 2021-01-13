'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'moment',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, academicContractDetails, moment) {

  var ac = this;
  ac.list_of_schools = [];
  ac.semester = academicContractDetails.semester.semester;
  ac.academic_year = academicContractDetails.academic_year;

  ac.saveScholar = function(){
    ac.degree = "Undergraduate";

    let scholar_details = {
      firstname: ac.firstname.toUpperCase(),
      lastname: ac.lastname.toUpperCase(),  
      middlename: ac.middlename.toUpperCase(),
      addressId: ac.addressId,
      date_of_birth: moment.changeFormat(ac.date_of_birth),
      age: ac.age,
      gender: ac.gender,
      schoolId: ac.schoolId,
      student_id_number: ac.student_id_number,
      IP: ac.IP,
      fatherId: ac.fatherId,
      motherId: ac.motherId,
      degree: ac.degree,
      scholar_status: 'NEW',
      scholar_asc_id: academicContractDetails.asc_id,
      father:{ f_firstname: ac.f_firstname.toUpperCase(), f_lastname: ac.search_flastname.toUpperCase(), f_middlename: ac.f_middlename.toUpperCase() },
      mother:{ m_firstname: ac.m_firstname.toUpperCase(), m_lastname: ac.search_mlastname.toUpperCase(), m_middlename: ac.m_middlename.toUpperCase() },
    }

    console.log(scholar_details);
    saveScholar(scholar_details);

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
    return getSchools(searched);
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


  function getSchools(searched){
    return schoolApiService.getSchools(searched).then(response=>{
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

  function saveScholar(scholarDetails){
     scholarApiService.saveScholar(scholarDetails).then(response => {
      console.log(response.data);
    }, err => {
      console.log(err);
    });
  }


  function getAddedScholars(){
     scholarApiService.getAddedScholars().then(response => {
      console.log(response.data);
      ac.scholars = response.data;
    }, err => {
      console.log(err);
    });    
  }


  getAddedScholars();
  console.log(academicContractDetails);

}]);
