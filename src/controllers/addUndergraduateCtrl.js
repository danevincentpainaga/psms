'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert', 'addScholarsService', '$mdSidenav',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, academicContractDetails, debounce, moment, swalert, addScholarsService, $mdSidenav) {

  var ac = this;
  ac.list_of_schools = [];
  ac.buttonText = 'Save';
  

  $scope.$watch('ac.scholar_lastname', debounce(function() {
    ac.scholars_loaded = false;
    getNewUndergraduateScholars({ searched: ac.scholar_lastname });
  }, 500), true);

  ac.clear = function(){
    addScholarsService.clearInputs(this);
  }  

  ac.saveNewUndergraduateDetails = function(){
    
    if (
          ac.firstname && ac.lastname && ac.middlename && ac.addressId && ac.date_of_birth
          && ac.age && ac.gender && ac.schoolId && ac.course_section && ac.year_level && ac.student_id_number
          && ac.IP && academicContractDetails.ascId && ac.search_flastname 
          && ac.f_firstname && ac.f_middlename && ac.search_mlastname && ac.m_firstname && ac.m_middlename
      ) {
        ac.buttonText = 'Saving...';
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
            student_id_number: ac.student_id_number.toUpperCase(),
            IP: ac.IP,
            degree: "Undergraduate",
            asc_id: academicContractDetails.ascId,
            father_details:{ firstname: ac.f_firstname.toUpperCase(), lastname: ac.search_flastname.toUpperCase(), middlename: ac.f_middlename.toUpperCase(), occupation: "" },
            mother_details:{ firstname: ac.m_firstname.toUpperCase(), lastname: ac.search_mlastname.toUpperCase(), middlename: ac.m_middlename.toUpperCase(), occupation: "" },
          }

          console.log(scholar_details);
          saveNewScholarDetails(scholar_details);

    }
    else{
      swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
    }
  }

  ac.edit = function(scholarDetails){
    ac.scholar_to_edit = scholarDetails;
    $mdSidenav('right').toggle();
  }

  ac.print = function(scholarDetails, idx){
    ac.selectedIndex = idx;
    print(scholarDetails);
  }

  ac.selectedFatherDetailsChange = function(fdetails){
    if (ac.father) {
      ac.f_firstname = fdetails.firstname;
      ac.f_middlename = fdetails.middlename;
    }
    else{
      ac.f_firstname = "";
      ac.f_middlename = "";
    }
  }

  ac.selectedMotherDetailsChange = function(mdetails){
    if (ac.mother) {
      ac.m_firstname = mdetails.firstname;
      ac.m_middlename = mdetails.middlename;
    }
    else{
      ac.m_firstname = "";
      ac.m_middlename = "";
    }
  }


  ac.selectedSchoolChange = function(school){
    if (school) {
      ac.schoolId = school.school_id;
    }
    else{
      ac.schoolId = null;
      ac.search_school = "";
    }
  }

  ac.selectedAddressChange = function(address){
    if (address) {
      ac.addressId = address.address_id;
    }
    else{
      ac.addressId = null;
      ac.search_address = "";
    }
  }

  ac.selectedDateOfBirth = function(dateOfBirth){
    ac.age = addScholarsService.calcAge(dateOfBirth);
    ac.displayedAge = ac.age;
  }

  ac.schoolSearchQuery = function(searched){
     return addScholarsService.getSearchedSchool(searched);
  }

  ac.addressSearchQuery = function(searched){
    return addScholarsService.getAddresses(searched);
  }

  ac.motherSearchQuery = function(searched){
    return addScholarsService.getMotherList(searched);
  }

  ac.fatherSearchQuery = function(searched){
    return addScholarsService.getFatherList(searched);
  }

  function saveNewScholarDetails(scholarDetails){
     scholarApiService.saveNewScholarDetails(scholarDetails).then(response => {
      addScholarsService.clearInputs(ac);
      ac.buttonText = 'Save';
      swalert.dialogBox('Scholar saved!', 'success', 'Success');
      print(scholarDetails);
    }, err => {
      ac.buttonText = 'Save';
      swalert.dialogBox(err.data.message, 'error', 'Failed');
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

  function print(scholarDetails){

    let docDefinition = {
        content: [
          {text: 'NAME: '+scholarDetails.firstname.toUpperCase()+" "+scholarDetails.lastname.toUpperCase()+", "+scholarDetails.middlename.toUpperCase()},
        ]
      };

    let pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.print({}, window.frames['printPdf']);
    
    pdfDocGenerator.getDataUrl((dataUrl) => {
      $timeout(()=>{ ac.selectedIndex = undefined }, 1000);
    });
  }

  function hasSemester(){
    if (academicContractDetails && academicContractDetails.contract_state != 'Closed') {
        ac.semester = academicContractDetails.academic_year_semester.semester
        ac.academic_year = academicContractDetails.academic_year_semester.academic_year;
        ac.has_semester = true;
    }
    else{
      ac.has_semester = false;
    }
    console.log(academicContractDetails);
  }

  hasSemester();

}]);