'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 


angular.module('psmsApp')
  .controller('addUndergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert', 'addScholarsService', '$mdSidenav',
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
            ac.firstname && ac.lastname && ac.middlename && ac.addressId && moment.validateDate(ac.date_of_birth) 
            && ac.age && ac.gender && ac.schoolId && ac.courseId && ac.section && ac.year_level && ac.student_id_number
            && ac.IP && academicContractDetails.ascId && ac.m_firstname && ac.search_maidenname && ac.m_middlename
        ) {

          ac.buttonText = 'Saving...';
          ac.saving = true;
        
            let scholar_details = {
              firstname: ac.firstname.toUpperCase(),
              lastname: ac.lastname.toUpperCase(),
              middlename: ac.middlename.toUpperCase(),
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
                firstname: (ac.m_firstname || "").toUpperCase(),
                maiden_name: (ac.search_maidenname || "").toUpperCase(),
                middlename: (ac.m_middlename || "").toUpperCase(),
                occupation: ""
              },
            }

            storeNewScholarDetails(scholar_details);

      }
      else{
        swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
      }
    }

    ac.edit = function(scholarDetails){
      ac.scholar_to_edit = scholarDetails;
      $mdSidenav('editScholar').toggle();
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
       return addScholarsService.getCourses({searched: searched});
    }

    ac.schoolSearchQuery = function(searched){
       return addScholarsService.getListOfSchool({searched_school: searched});
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

    function storeNewScholarDetails(scholarDetails){
        scholarApiService.storeNewScholarDetails(scholarDetails).then(response => {
        addScholarsService.clearInputs(ac);
        ac.buttonText = 'Save';
        ac.saving = false;
        swalert.dialogBox('Scholar saved!', 'success', 'Success');
        print(scholarDetails);
        getNewUndergraduateScholars({ searched: ac.scholar_lastname });
      }, err => {
        ac.buttonText = 'Save';
        ac.saving = false;
        swalert.dialogBox(err.data.message, 'error', 'Failed');
        console.log(err);
      });
    }

    function getNewUndergraduateScholars(searched){
       scholarApiService.getNewUndergraduateScholars(searched).then(response => {
        ac.scholars = response.data.data;
        ac.scholars_loaded = true;
      }, err => {
        console.log(err);
      });    
    }

    function print(scholarDetails){

      const pdfMake = require("pdfmake/build/pdfmake");
      const pdfFonts = require("pdfmake/build/vfs_fonts");
      pdfMake.vfs = pdfFonts.pdfMake.vfs;


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