'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addMastersDoctorateCtrl
 * @description
 * # addMastersDoctorateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addMastersDoctorateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert', 'addScholarsService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, academicContractDetails, debounce, moment, swalert, addScholarsService) {

  var md = this;
  md.list_of_schools = [];
  md.degree = "";
  md.buttonText = 'Save';

  $scope.$watch('md.scholar_lastname', debounce(function() {
    md.scholars_loaded = false;
    getNewMastersDoctorateScholars({ searched: md.scholar_lastname });
  }, 500), true);

  md.clear = function(){
    md.degree = "";
    md.degree_has_selected = false;
    addScholarsService.clearInputs(this);
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
          degree: md.degree,
          asc_id: academicContractDetails.ascId,
          father_details:{ firstname: md.f_firstname.toUpperCase(), lastname: md.search_flastname.toUpperCase(), middlename: md.f_middlename.toUpperCase(), occupation: "" },
          mother_details:{ firstname: md.m_firstname.toUpperCase(), lastname: md.search_mlastname.toUpperCase(), middlename: md.m_middlename.toUpperCase(), occupation: "" },
        }
            
        saveNewScholarDetails(scholar_details);    

    }
    else{
      swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
    }
  }

  md.edit = function(scholarDetails){
    md.scholar_to_edit = scholarDetails;
  }

  md.print = function(scholarDetails, idx){
    md.selectedIndex = idx;
    print(scholarDetails);
  }

  md.selectedDegree = function(){
    md.degree_has_selected = md.degree ?  true : false;
  }

  md.selectedFatherDetailsChange = function(fdetails){
    if (md.father) {
      md.f_firstname = fdetails.firstname;
      md.f_middlename = fdetails.middlename;
    }
    else{
      md.f_firstname = "";
      md.f_middlename = "";
    }
  }

  md.selectedMotherDetailsChange = function(mdetails){
    if (md.mother) {
      md.m_firstname = mdetails.firstname;
      md.m_middlename = mdetails.middlename;
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
      addScholarsService.clearInputs(md);
      md.buttonText = 'Save';
      swalert.dialogBox('Scholar saved!', 'success', 'Success');
    }, err => {
      console.log(err);
      swalert.dialogBox(err.data.message, 'success', 'Success');
    });
  }

  function getNewMastersDoctorateScholars(searched){
     scholarApiService.getNewMastersDoctorateScholars(searched).then(response => {
      md.scholars = response.data;
      md.scholars_loaded = true;
    }, err => {
      console.log(err);
    });    
  }

  function print(scholarDetails){

    let docDefinition = {
        content: [
          {text: 'NAME: '+scholarDetails.firstname.toUpperCase()+" "+scholarDetails.lastname.toUpperCase()+", "+scholarDetails.middlename.toUpperCase()},
        ]
      };

    let pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.print({}, window.frames['printPdf']);
    
    pdfDocGenerator.getDataUrl((dataUrl) => {
      $timeout(()=>{ md.selectedIndex = undefined }, 1000);
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