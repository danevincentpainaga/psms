'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addMastersDoctorateCtrl
 * @description
 * # addMastersDoctorateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('addMastersDoctorateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', '$mdSidenav', 'schoolApiService', 'addressApiService', 'scholarApiService', 'academicContractDetails', 'debounce', 'moment', 'swalert', 'addScholarsService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $mdSidenav, schoolApiService, addressApiService, scholarApiService, academicContractDetails, debounce, moment, swalert, addScholarsService) {

  var md = this;
  md.list_of_schools = [];
  md.degrees = ['Masters', 'Doctorate'];
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

      if (!md.f_firstname && !md.search_flastname || !md.m_firstname && !md.search_maidenname)
      {
        swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
        return;
      }

      if (!moment.validateDate(md.date_of_birth)) {
        swalert.toastInfo('Invalid Date of Birth', 'error', 'top-right', 4000);
        return;
      }

      if (!md.firstname || !md.lastname || !md.addressId || !md.age || !md.gender || !md.schoolId || !md.courseId || !md.section || !md.year_level || !md.student_id_number || !md.IP || !academicContractDetails.ascId)
      {
        swalert.toastInfo('please complete the form', 'error', 'top-right', 4000);
        return;
      }

        md.buttonText = 'Saving...';
        md.saving = true;

        let scholar_details = {
          firstname: md.firstname.toUpperCase(),
          lastname: md.lastname.toUpperCase(),
          middlename: (md.middlename || "").toUpperCase(),
          addressId: md.addressId,
          date_of_birth: md.date_of_birth,
          age: md.age,
          gender: md.gender,
          schoolId: md.schoolId,
          courseId: md.courseId,
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

  md.selectedDateOfBirth = function(dateOfBirth){
    md.age = addScholarsService.calcAge(dateOfBirth);
    md.displayedAge = md.age;
  }

  md.courseSearchQuery = function(searched){
    return addScholarsService.getCourses({searched: searched,  degree: JSON.stringify( ['Masters', 'Doctorate'])});
  }

  md.schoolSearchQuery = function(searched){
    return addScholarsService.getListOfSchool({searched_school: searched});
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

  function storeNewScholarDetails(scholarDetails){
     scholarApiService.storeNewScholarDetails(scholarDetails).then(response => {
      md.degree = "";
      md.degree_has_selected = false;
      addScholarsService.clearInputs(md);
      md.buttonText = 'Save';
      md.saving = false;
      getNewMastersDoctorateScholars({ searched: md.scholar_lastname });
      print(scholarDetails);
      swalert.dialogBox('Scholar saved!', 'success', 'Success');
    }, err => {
      console.log(err);
      swalert.dialogBox(err.data.message, 'success', 'Success');
    });
  }

  function getNewMastersDoctorateScholars(searched){
     scholarApiService.getNewMastersDoctorateScholars(searched).then(response => {
      console.log(response.data);
      md.scholars = response.data.data;
      md.scholars_loaded = true;
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