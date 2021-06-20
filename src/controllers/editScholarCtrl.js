'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:editScholarCtrl
 * @description
 * # editScholarCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('editScholarCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'addScholarsService', 'scholarApiService', 'swalert', 'moment', 'fileReader',
    function ($scope, $mdDialog, $mdSidenav, addScholarsService, scholarApiService, swalert, moment, fileReader) {

    var ec = this;
    ec.updatePhotoBtnText = 'Update';
    ec.primaryButtonText = 'Update';
    ec.parentsButtonText = 'Update';
    ec.enablePrimaryButtonText = 'Enable';
    ec.enableParentsButtonText = 'Enable';

    $scope.$watch('ec.schoolname', function(n, o){
      addScholarsService.getListOfSchool({searched_school: n}).then(response=>{
        ec.schools = response;
      }, err=>{
        console.log(err);
      });
    });

    $scope.$watch('ec.addressname', function(n, o){
      addScholarsService.getAddresses(n).then(response=>{
        ec.addresses = response;
      }, err=>{
        console.log(err);
      });
    });

    $scope.$watch('ec.coursename', function(n, o){
      addScholarsService.getCourses({ searched: n, degree: JSON.stringify([ec.degree]) }).then(response=>{
        ec.courses = response;
      }, err=>{
        console.log(err);
      });
    });

    $scope.$watch('scholar', function(n, o){

      if (o === undefined) {
        ec.copy = angular.copy(n);
      }

      if (n) {
        fillEditedScholar(n);
      }

    }, true);

    $scope.$watch('ec.binded_copy.date_of_birth', function(n, o){
      ec.age = addScholarsService.calcAge(n);
      ec.displayedAge = ec.age;
    }, true);  

    ec.closeModal = function(){
      $mdDialog.hide();
    }

    ec.selectedSchool = function(school){
      ec.binded_copy.school.school_name = school.school_name;
      ec.binded_copy.schoolId = school.school_id;
      ec.binded_copy.school.school_id = school.school_id;
      $mdDialog.hide();
    }

    ec.selectedAddress = function(address){
      ec.binded_copy.address.address = address.address;
      ec.binded_copy.addressId = address.address_id;
      ec.binded_copy.address.address_id = address.address_id;
      $mdDialog.hide();
    }

    ec.selectedCourse = function(course){
      ec.binded_copy.course.course = course.course;
      ec.binded_copy.courseId = course.courses_id;
      ec.binded_copy.course.course_id = course.courses_id;
      $mdDialog.hide();
    }

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
            ec.binded_copy.firstname && ec.binded_copy.lastname && ec.binded_copy.middlename && ec.binded_copy.addressId && moment.validateDate(ec.binded_copy.date_of_birth) 
            && ec.age && ec.binded_copy.gender && ec.binded_copy.schoolId && ec.binded_copy.courseId && ec.binded_copy.section && ec.binded_copy.year_level && ec.binded_copy.student_id_number
            && ec.binded_copy.IP
        ) {

          ec.updatingPrimaryDetails = true;
          ec.primaryButtonText = 'Updating...';

          let primary_scholar_details = {
            scholar_id: ec.binded_copy.scholar_id,
            student_id_number: ec.binded_copy.student_id_number.toUpperCase(),
            degree: ec.binded_copy.degree,
            firstname: ec.binded_copy.firstname.toUpperCase(),
            lastname: ec.binded_copy.lastname.toUpperCase(),
            middlename: ec.binded_copy.middlename.toUpperCase(),
            addressId: ec.binded_copy.addressId,
            date_of_birth: ec.binded_copy.date_of_birth,
            age: ec.age,
            gender: ec.binded_copy.gender,
            schoolId: ec.binded_copy.schoolId,
            courseId: ec.binded_copy.courseId,
            section: ec.binded_copy.section.toUpperCase(),
            year_level: ec.binded_copy.year_level,
            IP: ec.binded_copy.IP,
          }

          updateScholarDetails(primary_scholar_details);
      }
      else{
          swalert.toastInfo('please complete the form', 'error', 'top-right');
      }
    }

    ec.updateScholarParentsDetails = function(){

      if (ec.m_firstname && ec.search_maidenname) {

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
              maiden_name: (ec.search_maidenname || "").toUpperCase(), 
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
   	  $mdSidenav('editScholar').toggle();
      ec.primary_details = false;
      ec.parents_details = false;
      ec.enablePrimaryButtonText = 'Enable';
      ec.enableParentsButtonText = 'Enable';
    }

    // ec.selectedSchoolChange = function(school){
    //   ec.schoolId = school ? school.school_id : ec.copy.schoolId;
    // }

    // ec.selectedAddressChange = function(address){
    //   ec.addressId = address ? address.address_id : ec.copy.addressId;
    // }

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

    // ec.schoolSearchQuery = function(searched){
    //   if (searched != ec.copy.school.school_name) {
    //     return addScholarsService.getListOfSchool(searched);
    //   }
    //   return [ec.copy.school];
    // }

    // ec.courseSearchQuery = function(searched){
    //   if (searched != ec.copy.course.course) {
    //     return addScholarsService.getCourses({ searched: searched, degree: JSON.stringify([ec.degree]) });
    //   }
    //   return [ec.copy.course];
    // }

    // ec.addressSearchQuery = function(searched){
    //   if (searched != ec.copy.address.address) {
    //     return addScholarsService.getAddresses(searched);
    //   }
    //   return [ec.copy.address];
    // }

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

    ec.showSchoolModal = function(){
      showDialog('#mySchoolDialog');
    }

    ec.showAddressModal = function(){
      showDialog('#myAddressDialog');
    }

    ec.showCourseModal = function(){
      showDialog('#myCourseDialog');
    }

    function showDialog(dialogName) {
      $mdDialog.show({
        contentElement: dialogName,
        parent: angular.element(document.body)
      });
    }

    function updateScholarDetails(scholarDetails){
       scholarApiService.updateScholarDetails(scholarDetails).then(response => {
        updatePrimaryDetails(response.data);
        ec.primaryButtonText = 'Update';
        ec.updatingPrimaryDetails = false;
        swalert.dialogBox('Scholar updated!', 'success', 'Success');
      }, err => {
        ec.primaryButtonText = 'Update';
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    }

    function updateScholarParentsDetails(parentsDetails){
      scholarApiService.updateScholarParentsDetails(parentsDetails).then(response => {

        ec.binded_copy.father_details = JSON.stringify(response.data.father_details);
        ec.binded_copy.mother_details = JSON.stringify(response.data.mother_details);
        ec.binded_copy.updated_at = response.data.updated_at;

        ec.parentsButtonText = 'Update';
        ec.updatingParentsDetails = false;
        swalert.dialogBox('Parents details updated!', 'success', 'Success');

      }, err => {
        ec.parentsButtonText = 'Update';
        swalert.dialogBox(err.data.message, 'error', 'Failed');
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
      });
    }


    function updatePrimaryDetails(response){
      console.log(response);
      // ec.binded_copy.degree = ec.degree;
      // ec.binded_copy.firstname = ec.firstname;
      // ec.binded_copy.lastname = ec.lastname;
      // ec.binded_copy.middlename = ec.middlename;
      // ec.binded_copy.address.address_id = ec.addressId;
      // ec.binded_copy.addressId = ec.addressId;
      // ec.binded_copy.date_of_birth = ec.date_of_birth;
      // ec.binded_copy.age = ec.age;
      // ec.binded_copy.gender = ec.gender;
      // ec.binded_copy.schoolId = ec.schoolId;
      // ec.binded_copy.school.school_id = ec.schoolId;
      // ec.binded_copy.school.school_name = ec.search_school;
      // ec.binded_copy.courseId = ec.courseId;
      // ec.binded_copy.section = ec.section;
      // ec.binded_copy.course.course = ec.search_course;
      // ec.binded_copy.year_level = ec.year_level;
      // ec.binded_copy.IP = ec.IP;
      ec.binded_copy.updated_at = response;
    }


    function fillEditedScholar(scholar){
        console.log(scholar);
        let father = typeof scholar.father_details === 'object'? scholar.father_details : JSON.parse(scholar.father_details);
        let mother = typeof scholar.mother_details === 'object'? scholar.mother_details : JSON.parse(scholar.mother_details);

        ec.icon = (scholar.degree === 'Masters' || scholar.degree === 'Doctorate')  ? 'school' : 'groups';
        ec.binded_copy = scholar;
        // ec.photo = scholar.photo;
        
        // ec.addressId = scholar.addressId;
        // ec.schoolId = scholar.schoolId;
        // ec.courseId = scholar.courseId;
        // ec.academic_year = scholar.academicyear_semester_contract.academic_year;
        // ec.semester = scholar.academicyear_semester_contract.semester;
        // ec.firstname = scholar.firstname;
        // ec.lastname = scholar.lastname;
        // ec.middlename = scholar.middlename;
        // ec.date_of_birth = scholar.date_of_birth;
        // ec.gender = scholar.gender;
        // ec.year_level = scholar.year_level;
        // ec.student_id_number = scholar.student_id_number;
        // ec.IP = scholar.IP;
        // ec.search_address = scholar.address.address;
        // ec.search_school = scholar.school.school_name;
        // ec.course = scholar.course.course;
        // ec.section = scholar.section;
        ec.search_flastname = father.lastname;
        ec.f_firstname = father.firstname;
        ec.f_middlename = father.middlename;
        ec.search_maidenname = mother.maiden_name;
        ec.m_firstname = mother.firstname;
        ec.m_middlename = mother.middlename;
        ec.degree = scholar.degree;
        ec.f_occupation = father.occupation;
        ec.m_occupation = mother.occupation;

    }

}]);
