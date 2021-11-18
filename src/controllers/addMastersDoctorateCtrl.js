'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addMastersDoctorateCtrl
 * @description
 * # addMastersDoctorateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addMastersDoctorateCtrl',
  [
    '$scope',
    '$rootScope',
    '$cookies',
    '$window',
    '$location',
    '$timeout',
    'schoolApiService',
    'addressApiService',
    'scholarApiService',
    'academicContractDetails',
    'debounce',
    'moment',
    'swalert',
    'addScholarsService',
    'printContract',
    '$mdSidenav',
  function (
    $scope,
    $rootScope,
    $cookies,
    $window,
    $location,
    $timeout,
    schoolApiService,
    addressApiService,
    scholarApiService,
    academicContractDetails,
    debounce,
    moment,
    swalert,
    addScholarsService,
    printContract,
    $mdSidenav) {

  var md = this;
  md.gender_list = ['Male', 'Female'];
  md.civil_status_list = addScholarsService.civilStatus();
  md.year_levels = addScholarsService.yearLevels();
  md.IP_list = ['YES', 'NO'];
  md.list_of_schools = [];
  md.scholars = [];
  md.degrees = ['Masters', 'Doctorate'];
  md.degree = "";
  md.hide_load_more = true;
  md.suffix = "NONE";
  md.father_suffix = "NONE";

  $scope.$watch('md.scholar_lastname', debounce(function() {
    md.scholars_loaded = false;
    md.scholars = [];
    let show = md.scholar_lastname ? true : false; 
    getNewMastersDoctorateScholars(null, md.scholar_lastname);
  }, 500), true);

  md.changeView = function(){
    md.displayview = md.displayview ? false : true;
  }

  md.loadmore = function(){
    md.hide_load_more = true;
    if (md.load_busy || md.toPage === null) {
      md.hide_load_more = true;
      return;
    }
    getNewMastersDoctorateScholars(md.toPage, md.scholar_lastname);
  }

  md.clear = function(){
    md.degree = "";
    addScholarsService.clearInputs(this);
    md.scholar_details.$setPristine();
    md.scholar_details.$setUntouched();
    md.degree_has_selected = false;
  }  

  md.saveNewMasterDoctorateDetails = function(){

      if (!md.firstname || !md.lastname || !md.addressId || !md.gender || !md.schoolId || !md.courseId || !md.section || !md.year_level || !md.student_id_number || !md.IP || !academicContractDetails.ascId)
      {
        swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
        return;
      }

      if (md.search_flastname && !md.f_firstname || md.f_firstname && !md.search_flastname || md.f_middlename && !md.search_flastname || md.f_middlename && !md.f_firstname) {
        swalert.toastInfo('please complete father details', 'error', 'top-right', 4000);
        return;
      }

      if (md.m_firstname && !md.search_maidenname || md.search_maidenname && !md.m_firstname) {
        swalert.toastInfo('please complete mother details', 'error', 'top-right', 4000);
        return;
      }

      if (!moment.validateDate(md.date_of_birth)) {
        swalert.toastInfo('Invalid Date of Birth', 'error', 'top-right', 4000);
        return;
      }

        md.saving = true;

        let scholar_details = {
          firstname: md.firstname.toUpperCase(),
          lastname: md.lastname.toUpperCase(),
          middlename: (md.middlename || "").toUpperCase(),
          suffix: md.suffix === 'NONE'? null : md.suffix.toUpperCase(),
          academicyear_semester_contract: academicContractDetails.academic_year_semester,
          addressId: md.addressId,
          address: md.fulladdress,
          date_of_birth: md.date_of_birth,
          age: md.age,
          gender: md.gender,
          civil_status: md.civil_status,
          schoolId: md.schoolId,
          school: md.school,
          courseId: md.courseId,
          course: md.course,
          section: md.section.toUpperCase(),
          year_level: md.year_level.toUpperCase(),
          student_id_number: md.student_id_number.toUpperCase(),
          IP: md.IP,
          degree: md.degree,
          contract_id: academicContractDetails.activated_contract_id,
          asc_id: academicContractDetails.ascId,
          father_details:{ 
            firstname: (md.f_firstname || "").toUpperCase(),
            lastname: (md.search_flastname || "").toUpperCase(),
            middlename: (md.f_middlename || "").toUpperCase(),
            suffix: md.father_suffix === 'NONE'? "" : md.father_suffix.toUpperCase(),
            occupation: ""
          },
          mother_details:{ 
            firstname: md.m_firstname.toUpperCase(),
            maiden_name: md.search_maidenname.toUpperCase(),
            middlename: (md.m_middlename || "").toUpperCase(),
            occupation: ""
          },
        }
            
        storeNewScholarDetails(scholar_details);
        console.log(scholar_details); 
  }

  md.edit = function(scholarDetails){
    md.scholar_to_edit = scholarDetails;
    $mdSidenav('editScholar').toggle();
  }

  md.print = function(scholarDetails, idx){
    md.selectedIndex = idx;
    printContract.print(scholarDetails, md, academicContractDetails.governor);
  }

  md.selectedDegree = function(){
    md.degree_has_selected = md.degree ?  true : false;
    md.search_course = "";
    md.courseId = "";
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

  md.selectedCourseChange = function(course){
    if (course) {
      md.courseId = course.course_id;
    }
    else{
      md.courseId = null;
      md.search_course = "";
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

  md.selectedFatherDetailsChange = function(fdetails){
    validateParentDetails(fdetails, 'f_firstname', 'f_middlename');
  }

  md.selectedMotherDetailsChange = function(mdetails){
    validateParentDetails(mdetails, 'm_firstname', 'm_middlename');
  }

  md.selectedDateOfBirth = function(dateOfBirth){
    md.age = addScholarsService.calcAge(dateOfBirth);
    md.displayedAge = md.age;
    if (!moment.validateDate(dateOfBirth)) {
      md.scholar_details.date_of_birth.$setValidity("date_of_birth", false);
      return;
    }
    md.scholar_details.date_of_birth.$setValidity("date_of_birth", true);
  }

  md.courseSearchQuery = function(searched){
    return addScholarsService.getCourses({searched: searched,  degree: JSON.stringify( [md.degree])});
  }

  md.schoolSearchQuery = function(searched){
    return addScholarsService.getListOfSchool({searched_school: searched});
  }

  md.addressSearchQuery = function(searched){
    return addScholarsService.getAddresses(searched).then(response => {
      for (var i = 0; i < response.length; i++) {
        Object.assign(response[i], { fulladdress: response[i].address+' '+response[i].municipality+', ANTIQUE' });
      }
      return response;
    });
  }

  md.motherSearchQuery = function(searched){
    return addScholarsService.getMotherList(searched);
  }

  md.fatherSearchQuery = function(searched){
    return addScholarsService.getFatherList(searched);
  }

  function validateParentDetails(fdetails, fname, mname){
    if (fdetails) {
      md[fname] = fdetails.firstname;
      md[mname] = fdetails.middlename;
    }
    else{
      md[fname] = "";
      md[mname] = "";
    }
  }

  function storeNewScholarDetails(scholarDetails){
     scholarApiService.storeNewScholarDetails(scholarDetails).then(response => {
      md.clear();
      md.saving = false;
      swalert.toastInfo('Scholar saved!', 'success', 'top-right');
      printContract.print(scholarDetails, md, academicContractDetails.governor);
      getNewMastersDoctorateScholars();
    }, err => {
      console.log(err);
      md.saving = false;
      swalert.toastInfo(err.data.message,  'error', 'top-right');
    });
  }

  function getNewMastersDoctorateScholars(url = null, searchedValue = undefined){
      let searched = { searched: searchedValue };
      md.load_busy = true;
      scholarApiService.getNewMastersDoctorateScholars(searched, url).then(response => {
      console.log(response.data);
      hideLoadMore(response.data.next_page_url);
      md.toPage = response.data.next_page_url;
      md.scholars = url? [...md.scholars, ...response.data.data] : response.data.data;
      md.scholars_loaded = true;
      md.load_busy = false;
    }, err => {
      console.log(err);
    }); 
  }

  function hideLoadMore(next_page_url){
    md.hide_load_more = next_page_url === null? true : false;
  }

  function loadSuffix(){
    addScholarsService.getSuffix().then(response => {
      console.log(response);
      md.suffix_list = response.data;
    }, err => {
      console.log(err);
    });
  }

  function hasSemester(){
      md.semester = academicContractDetails.academic_year_semester.semester;
      md.academic_year = academicContractDetails.academic_year_semester.academic_year;
  }
  
  loadSuffix();
  hasSemester();

}]);