'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 


angular.module('psmsApp')
  .controller('addUndergraduateCtrl',
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

    var ac = this;
    ac.list_of_schools = [];
    ac.scholars = [];
    ac.buttonText = 'Save';
    ac.hide_load_more = true;

    $scope.$watch('ac.scholar_lastname', debounce(function() {
      ac.scholars_loaded = false;
      ac.scholars = [];
      let show = ac.scholar_lastname ? true : false; 
      getNewUndergraduateScholars({ searched: ac.scholar_lastname }, ac.toPage = null);
    }, 500), true);

    ac.changeView = function(){
      ac.displayview = ac.displayview ? false : true;
    }

    ac.loadmore = function(){
      ac.hide_load_more = true;
      if (ac.load_busy || ac.toPage === null) {
        ac.hide_load_more = true;
        return;
      }
      getNewUndergraduateScholars({ searched: ac.scholar_lastname }, ac.toPage);
    }

    ac.clear = function(){
      addScholarsService.clearInputs(this);
      ac.scholar_details.$setPristine();
      ac.scholar_details.$setUntouched();
    }  

    ac.saveNewUndergraduateDetails = function(){

      if (!ac.firstname || !ac.lastname || !ac.addressId || !ac.age || !ac.gender || !ac.schoolId || !ac.courseId || !ac.section || !ac.year_level || !ac.student_id_number || !ac.IP || !academicContractDetails.ascId)
      {
        swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
        return;
      }

      if (ac.search_flastname && !ac.f_firstname || ac.f_firstname && !ac.search_flastname || ac.f_middlename && !ac.search_flastname || ac.f_middlename && !ac.f_firstname) {
        swalert.toastInfo('please complete father details', 'error', 'top-right', 4000);
        return;
      }

      if (ac.m_firstname && !ac.search_maidenname || ac.search_maidenname && !ac.m_firstname) {
        swalert.toastInfo('please complete mother details', 'error', 'top-right', 4000);
        return;
      }

      if (!moment.validateDate(ac.date_of_birth)) {
        swalert.toastInfo('Invalid Date of Birth', 'error', 'top-right', 4000);
        return;
      }

      ac.buttonText = 'Saving...';
      ac.saving = true;
    
        let scholar_details = {
          firstname: ac.firstname.toUpperCase(),
          lastname: ac.lastname.toUpperCase(),
          middlename: (ac.middlename || "").toUpperCase(),
          addressId: ac.addressId,
          date_of_birth: ac.date_of_birth,
          age: ac.age,
          gender: ac.gender,
          schoolId: ac.schoolId,
          courseId: ac.courseId,
          section: ac.section.toUpperCase(),
          year_level: ac.year_level.toUpperCase(),
          student_id_number: ac.student_id_number.toUpperCase(),
          IP: ac.IP,
          degree: "Undergraduate",
          contract_id: academicContractDetails.activated_contract_id,
          asc_id: academicContractDetails.ascId,
          father_details:{ 
            firstname: (ac.f_firstname || "").toUpperCase(),
            lastname: (ac.search_flastname || "").toUpperCase(),
            middlename: (ac.f_middlename || "").toUpperCase(),
            occupation: ""
          },
          mother_details:{ 
            firstname: ac.m_firstname.toUpperCase(),
            maiden_name: ac.search_maidenname.toUpperCase(),
            middlename: (ac.m_middlename || "").toUpperCase(),
            occupation: ""
          },
        }

        storeNewScholarDetails(scholar_details);
        console.log(scholar_details);
    }

    ac.edit = function(scholarDetails){
      ac.scholar_to_edit = scholarDetails;
      $mdSidenav('editScholar').toggle();
    }

    ac.print = function(scholarDetails, idx){
      ac.selectedIndex = idx;
      printContract.print(scholarDetails, ac);
    }

    ac.selectedFatherDetailsChange = function(fdetails){
      validateParentDetails(fdetails, 'f_firstname', 'f_middlename');
    }

    ac.selectedMotherDetailsChange = function(mdetails){
      validateParentDetails(mdetails, 'm_firstname', 'm_middlename');
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

    ac.selectedCourseChange = function(course){
      if (course) {
        ac.courseId = course.course_id;
      }
      else{
        ac.courseId = null;
        ac.search_course = "";
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

     ac.courseSearchQuery = function(searched){
       return addScholarsService.getCourses({searched: searched, degree: JSON.stringify(['Undergraduate'])});
    }

    ac.schoolSearchQuery = function(searched){
       return addScholarsService.getListOfSchool({searched_school: searched});
    }

    ac.addressSearchQuery = function(searched){
      return addScholarsService.getAddresses(searched).then(response => {
        for (var i = 0; i < response.length; i++) {
          Object.assign(response[i], { address: response[i].address+' '+response[i].municipality+', ANTIQUE' });
        }
        return response;
      });
    }

    ac.motherSearchQuery = function(searched){
      return addScholarsService.getMotherList(searched);
    }

    ac.fatherSearchQuery = function(searched){
      return addScholarsService.getFatherList(searched);
    }

    function validateParentDetails(fdetails, fname, mname){
      if (fdetails) {
        ac[fname] = fdetails.firstname;
        ac[mname] = fdetails.middlename;
      }
      else{
        ac[fname] = "";
        ac[mname] = "";
      }
    }

    function storeNewScholarDetails(scholarDetails){
        scholarApiService.storeNewScholarDetails(scholarDetails).then(response => {
        ac.clear();
        ac.buttonText = 'Save';
        ac.saving = false;
        swalert.toastInfo('Scholar saved!', 'success', 'top-right');
        printContract.print(scholarDetails, ac);
        ac.scholar_details.$setUntouched();
        getNewUndergraduateScholars({ searched: undefined }, null );
      }, err => {
        ac.buttonText = 'Save';
        ac.saving = false;
        swalert.toastInfo(err.data.message,  'error', 'top-right');
        console.log(err);
      });
    }

    function getNewUndergraduateScholars(searched, url){
       ac.load_busy = true;
       scholarApiService.getNewUndergraduateScholars(searched, url).then(response => {
        console.log(response.data);
        hideLoadMore(response.data.next_page_url);
        ac.toPage = response.data.next_page_url;
        ac.scholars = url? [...ac.scholars, ...response.data.data] : response.data.data;
        ac.scholars_loaded = true;
        ac.load_busy = false;
      }, err => {
        console.log(err);
      });    
    }

    function hideLoadMore(next_page_url){
      if (next_page_url === null) {
        ac.hide_load_more = true;
      }
      else{
        ac.hide_load_more = false;
      }
    }

    function hasSemester(){
      ac.semester = academicContractDetails.academic_year_semester.semester;
      ac.academic_year = academicContractDetails.academic_year_semester.academic_year;
    }

    hasSemester();

}]);