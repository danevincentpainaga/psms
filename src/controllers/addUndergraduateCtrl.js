'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService) {

  var ac = this;
  ac.list_of_schools = [];

  ac.saveScholar = function(){
    ac.degree = "Undergraduate";

    let scholar_details = {
      firstname: ac.firstname,
      lastname: ac.lastname,
      middlename: ac.middlename,
      addressId: ac.addressId,
      date_of_birth: ac.date_of_birth,
      age: ac.age,
      gender: ac.gender,
      schoolId: ac.schoolId,
      student_id_number: ac.student_id_number,
      IP: ac.IP,
      fatherId: ac.fatherId,
      motherId: ac.motherId,
      degree: ac.degree,
      status: ac.status,
      father:{ f_firstname: ac.f_firstname, f_lastname: ac.search_flastname, f_middlename: ac.f_middlename },
      mother:{ m_firstname: ac.m_firstname, m_lastname: ac.search_mlastname, m_middlename: ac.m_middlename },
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

  ac.searchSchoolChange = function(searched){
    console.log(searched);
  }

  function getSchools(searched){
    return schoolApiService.getSchools(searched).then((response)=>{
      return response.data;
    }, function(err){
      console.log(err);
    });
  }

  function getAddresses(data){
    return addressApiService.getAddresses({searched: data}).then((response)=>{
      console.log(response.data);
      return response.data;
    }, function(err){
      console.log(err);
    });
  }

  function getMotherList(data){
    return scholarApiService.getMotherList({searched: data}).then((response)=>{
      console.log(response.data);
      return response.data;
    }, function(err){
      console.log(err);
    });
  }

  function getFatherList(data){
    return scholarApiService.getFatherList({searched: data}).then((response)=>{
      console.log(response.data);
      return response.data;
    }, function(err){
      console.log(err);
    });
  }

  ac.fatherSearch = [
      {father_details_id: 1, firstname: 'Manuelo', lastname: 'Painaga', middlename: 'Gallego'},
      {father_details_id: 2, firstname: 'Juan', lastname: 'Dela Cruz', middlename: 'Success'},
  ];

  ac.motherSearch = [
      {mother_details_id: 1, firstname: 'Yolinda', lastname: 'Painaga', middlename: 'Paulino'},
      {mother_details_id: 2, firstname: 'Jolina', lastname: 'Dela Cruz', middlename: 'Winner'},
  ];


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

  function saveScholar(scholarDetails){
     scholarApiService.saveScholar(scholarDetails).then((response)=>{
      console.log(response.data);
      response.data;
    }, function(err){
      console.log(err);
    });
  }


}]);
