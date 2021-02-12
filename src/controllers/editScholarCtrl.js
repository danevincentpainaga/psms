'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:editScholarCtrl
 * @description
 * # editScholarCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('editScholarCtrl', ['$scope', '$rootScope', '$mdDialog', '$q', '$mdSidenav', 'addScholarsService', 'scholarApiService', 'swalert', 'moment', 'fileReader',
    function ($scope, $rootScope, $mdDialog, $q, $mdSidenav, addScholarsService, scholarApiService, swalert, moment, fileReader) {

  var ec = this;
  ec.updatePhotoBtnText = 'Update';
  ec.primaryButtonText = 'Update';
  ec.parentsButtonText = 'Update';
  ec.enablePrimaryButtonText = 'Enable';
  ec.enableParentsButtonText = 'Enable';

  $scope.$watch('scholar', function(n, o){
    if (n) {
    	console.log(n);
      ec.icon = (n.degree === 'Masters' || n.degree === 'Doctorate')  ? 'school' : 'groups';
      ec.binded_copy = n;
      ec.photo = n.photo;
      ec.copy = angular.copy(n);
      ec.addressId = n.addressId;
      ec.schoolId = n.schoolId;
      ec.courseId = n.courseId;
    	ec.academic_year = n.academicyear_semester_contract.academic_year;
    	ec.semester = n.academicyear_semester_contract.semester;
    	ec.firstname = n.firstname;
    	ec.lastname = n.lastname;
    	ec.middlename = n.middlename;
    	ec.date_of_birth = n.date_of_birth;
    	ec.gender = n.gender;
    	ec.year_level = n.year_level;
    	ec.student_id_number = n.student_id_number;
    	ec.IP = n.IP;
    	ec.search_address = n.address.address;
    	ec.search_school = n.school.school_name;
    	ec.course = n.course.course;
      ec.section = n.section;
    	ec.search_flastname = n.father_details.lastname;
    	ec.f_firstname = n.father_details.firstname;
    	ec.f_middlename = n.father_details.middlename;
    	ec.search_mlastname = n.mother_details.lastname;
    	ec.m_firstname = n.mother_details.firstname;
    	ec.m_middlename = n.mother_details.middlename;
      ec.degree = n.degree;
      ec.f_occupation = n.father_details.occupation;
      ec.m_occupation = n.mother_details.occupation;
    }
  }, true);

  $scope.$watch('ec.date_of_birth', function(n, o){
    ec.age = addScholarsService.calcAge(n);
    ec.displayedAge = ec.age;
  }, true);  


  ec.editPhoto  = function(){
    ec.editing = true;
  }

  ec.getTheFiles = function(file){

    var formdata = new FormData();

    formdata.append('file', file[0]);
    formdata.append('scholar_id', ec.copy.scholar_id);
    ec.new_photo = formdata;

    fileReader.readAsDataUrl(file[0], $scope)
      .then(function(result) {
        ec.result_photo = result;
        ec.image_selected = true;
      }, function(err){
        console.log(err);
      });
  }

  ec.updatePhoto = function(){
    ec.updating = true;
    ec.updatePhotoBtnText = 'Updating...';
    uploadProfilePic(ec.new_photo);
  }

  ec.cancel = function(){
    ec.editing = false;
    ec.new_photo = "";
    ec.result_photo = undefined;
    ec.image_selected = false;
  }

  ec.enableDisablePrimaryDetails = function(){
    if (!ec.primary_details) {
      ec.enablePrimaryButtonText = 'Disable';
      ec.primary_details = true;
    }
    else{
      ec.enablePrimaryButtonText = 'Enable';
      ec.primary_details = false;
    }
  }
  
  ec.enableDisableParentsDetails = function(){
    if (!ec.parents_details) {
      ec.enableParentsButtonText = 'Disable';
      ec.parents_details = true;
    }
    else{
      ec.enableParentsButtonText = 'Enable';
      ec.parents_details = false;
    }
  }

  ec.updateScholarPrimaryDetails = function(){

    if (
          ec.firstname && ec.lastname && ec.middlename && ec.addressId && moment.validateDate(ec.date_of_birth) 
          && ec.age && ec.gender && ec.schoolId && ec.courseId && ec.section && ec.year_level && ec.student_id_number
          && ec.IP
      ) {

        ec.updatingPrimaryDetails = true;
        ec.primaryButtonText = 'Updating...';

        let primary_scholar_details = {
          scholar_id: ec.copy.scholar_id,
          student_id_number: ec.student_id_number.toUpperCase(),
          degree: ec.degree,
          firstname: ec.firstname.toUpperCase(),
          lastname: ec.lastname.toUpperCase(),
          middlename: ec.middlename.toUpperCase(),
          addressId: ec.addressId,
          date_of_birth: ec.date_of_birth,
          age: ec.age,
          gender: ec.gender,
          schoolId: ec.schoolId,
          courseId: ec.courseId,
          section: ec.section.toUpperCase(),
          year_level: ec.year_level,
          IP: ec.IP,
        }

        console.log(primary_scholar_details);
        updateScholarDetails(primary_scholar_details);
    }
    else{
        swalert.toastInfo('please complete the form', 'error', 'top-right');
    }
  }

  ec.updateScholarParentsDetails = function(){

    if (ec.m_firstname && ec.search_mlastname && ec.m_middlename) {

      ec.updatingParentsDetails = true;
      ec.parentsButtonText = 'Updating...';
      
      let parentsDetails = {
        scholar_id: ec.copy.scholar_id,
        father_details:{ 
            firstname: (ec.f_firstname || "").toUpperCase(),
            lastname: (ec.search_flastname || "").toUpperCase(),
            middlename: (ec.f_middlename || "").toUpperCase(),
            occupation: (ec.f_occupation || "").toUpperCase(),
        },
        mother_details:{ 
            firstname: (ec.m_firstname || "").toUpperCase(), 
            lastname: (ec.search_mlastname || "").toUpperCase(), 
            middlename: (ec.m_middlename || "").toUpperCase(), 
            occupation: (ec.m_occupation || "").toUpperCase(),
        },
      }

      updateScholarParentsDetails(parentsDetails);
    }
    else{
        swalert.toastInfo('Mother details is required', 'error', 'top-right');
    }
  }

  ec.close = function(){
  	$scope.scholar = undefined;
 	  $mdSidenav('right').toggle();
    ec.primary_details = false;
    ec.parents_details = false;
    ec.enablePrimaryButtonText = 'Enable';
    ec.enableParentsButtonText = 'Enable';
  }

  ec.selectedSchoolChange = function(school){
    ec.schoolId = school ? school.school_id : ec.copy.schoolId;
  }

  ec.selectedAddressChange = function(address){
    ec.addressId = address ? address.address_id : ec.copy.addressId;
  }

  ec.selectedFatherDetailsChange = function(fdetails){
    if (fdetails){
      ec.f_firstname = fdetails.firstname;
      ec.f_middlename = fdetails.middlename;
    }
  }

  ec.selectedMotherDetailsChange = function(mdetails){
    if (mdetails){
      ec.m_firstname = mdetails.firstname;
      ec.m_middlename = mdetails.middlename;
    }
  }

  ec.schoolSearchQuery = function(searched){
    if (searched != ec.copy.school.school_name) {
      return addScholarsService.getListOfSchool(searched);
    }
    return [ec.copy.school];
  }

  ec.courseSearchQuery = function(searched){
    if (searched != ec.copy.course.course) {
      return addScholarsService.getCourses(searched);
    }
    return [ec.copy.course];
  }

  ec.addressSearchQuery = function(searched){
    if (searched != ec.copy.address.address) {
      return addScholarsService.getAddresses(searched);
    }
    return [ec.copy.address];
  }

  ec.motherSearchQuery = function(searched){
    if (searched != ec.copy.mother_details.lastname) {
      return addScholarsService.getMotherList(searched);
    }
    return [ec.copy.mother_details];
  }

  ec.fatherSearchQuery = function(searched){
    if (searched != ec.copy.father_details.lastname) {
      return addScholarsService.getFatherList(searched);
    }
    return [ec.copy.father_details];
  }

  function updateScholarDetails(scholarDetails){
     scholarApiService.updateScholarDetails(scholarDetails).then(response => {
      console.log(response.data);
      updatePrimaryDetails(response.data);
      ec.primaryButtonText = 'Update';
      ec.updatingPrimaryDetails = false;
      swalert.dialogBox('Scholar updated!', 'success', 'Success');
    }, err => {
      ec.primaryButtonText = 'Update';
      swalert.dialogBox(err.data.message, 'error', 'Failed');
      console.log(err);
    });
  }

  function updateScholarParentsDetails(parentsDetails){
    scholarApiService.updateScholarParentsDetails(parentsDetails).then(response => {
      console.log(response.data);

      ec.binded_copy.father_details = response.data.father_details;
      ec.binded_copy.mother_details = response.data.mother_details;
      ec.binded_copy.updated_at = response.data.updated_at;

      ec.parentsButtonText = 'Update';
      ec.updatingParentsDetails = false;
      swalert.dialogBox('Parents details updated!', 'success', 'Success');

    }, err => {
      ec.parentsButtonText = 'Update';
      swalert.dialogBox(err.data.message, 'error', 'Failed');
      console.log(err);
    });
  }

  function uploadProfilePic(image){
    scholarApiService.uploadProfilePic(image).then(response => {
      ec.binded_copy.photo = response.data;
      ec.cancel();
      ec.updating = false;
      ec.updatePhotoBtnText = 'Update';
      swalert.toastInfo('Profile updated', 'success', 'top-right', 4000);
    }, err => {
      swalert.toastInfo(err.data, 'error', 'top-right', 4000);
      console.log(err);
    });
  }


  function updatePrimaryDetails(response){
    ec.binded_copy.degree = ec.degree;
    ec.binded_copy.firstname = ec.firstname;
    ec.binded_copy.lastname = ec.lastname;
    ec.binded_copy.middlename = ec.middlename;
    ec.binded_copy.address.address_id = ec.addressId;
    ec.binded_copy.addressId = ec.addressId;
    ec.binded_copy.date_of_birth = ec.date_of_birth;
    ec.binded_copy.age = ec.age;
    ec.binded_copy.gender = ec.gender;
    ec.binded_copy.schoolId = ec.schoolId;
    ec.binded_copy.school.school_id = ec.schoolId;
    ec.binded_copy.school.school_name = ec.search_school;
    ec.binded_copy.courseId = ec.courseId;
    ec.binded_copy.section = ec.section;
    ec.binded_copy.course.course = ec.search_course;
    ec.binded_copy.year_level = ec.year_level;
    ec.binded_copy.IP = ec.IP;
    ec.binded_copy.updated_at = response;
  }

}]);
