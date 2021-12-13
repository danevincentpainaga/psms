'use strict';

import { data } from "jquery";

/**
 * @ngdoc function
 * @name psmsApp.controller:editScholarCtrl
 * @description
 * # editScholarCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('editScholarCtrl', [
      '$rootScope',
      '$scope',
      '$mdDialog',
      '$mdSidenav',
      'addScholarsService',
      'scholarApiService',
      'swalert',
      'moment',
      '$filter',
    function (
      $rootScope,
      $scope,
      $mdDialog,
      $mdSidenav,
      addScholarsService,
      scholarApiService,
      swalert,
      moment,
      $filter) {

    var ec = this;
    ec.updatePhotoBtnText = 'Update';
    ec.enablePrimaryButtonText = 'Enable';
    ec.enableParentsButtonText = 'Enable';
    ec.gender_list = ['Male', 'Female'];
    ec.civil_status_list = addScholarsService.civilStatus();
    ec.year_levels = addScholarsService.yearLevels();
    ec.IP_list = ['YES', 'NO'];

    $scope.$watch('scholar', function(n, o){
      if (o === undefined) {
        ec.copy = angular.copy(n);
      }
      if (n) {
        runIfHasScholar();
        fillEditScholar(n);
      }
    });

    $scope.$watch('ec.date_of_birth', function(n, o){
      if(n){
        ec.age = addScholarsService.calcAge(n);
        ec.displayedAge = ec.age;
        if (!moment.validateDate(n)) {
          ec.primaryDetailsForm.date_of_birth.$setValidity("date_of_birth", false);
          return;
        }
        ec.primaryDetailsForm.date_of_birth.$setValidity("date_of_birth", true);
      }
    }, true);

    ec.degreeChange = function(){
      if(ec.degree === ec.copy.degree){
        ec.course = ec.copy.course.course;
        ec.courseId = ec.copy.courseId;    
      } 
      else
      {
        ec.course = '';
        ec.courseId = '';
        ec.primaryDetailsForm.$setDirty();
      }
    }

    ec.closeModal = function(){
      $mdDialog.hide();
    }

    ec.selectedSchool = function(school){
      delete school.$$hashKey;
      ec.schoolObj = school;
      ec.school_name = school.school_name;
      ec.schoolId = school.school_id;
      ec.primaryDetailsForm.$setDirty();
      $mdDialog.hide();
    }

    ec.selectedAddress = function(address){
      ec.newaddress = $filter('formatAddress')(address);
      delete address.$$hashKey;
      ec.addressObj = address;
      ec.addressId = address.address_id;
      ec.primaryDetailsForm.$setDirty();
      $mdDialog.hide();
    }

    ec.selectedCourse = function(course){
      delete course.$$hashKey;
      ec.courseObj = course;
      ec.course = course.course;
      ec.courseId = course.course_id;
      ec.primaryDetailsForm.$setDirty();
      $mdDialog.hide();
    }

    ec.editPhoto  = function(){
      ec.editing = true;
    }

    ec.getTheFiles = function(file){
      var formdata = new FormData();
      // formdata.append('file', file[0]);
      console.log(file[0]);

      // fileReader.readAsDataUrl(file[0], $scope)
      //   .then(function(result) {
      //     ec.result_photo = result;
      //     ec.image_selected = true;
      //     console.log(result);
      //   }, function(err){
      //     console.log(err);
      //   });

      ec.resizeImage({
        file: file[0],
        maxSize: 300
      }).then(function (resizedImage) {
          ec.result_photo = resizedImage.dataurl;
          ec.image_selected = true;
          $scope.$apply(ec.image_selected);
          formdata.append('scholar_id', ec.copy.scholar_id);
          formdata.append('file', resizedImage.newfile);
          ec.new_photo = formdata;
          console.log(resizedImage.newfile)
      }).catch(function (err) {
          console.error(err);
      });
    }

    ec.updatePhoto = function(){
      ec.updating = true;
      ec.updatePhotoBtnText = 'Updating...';
      uploadProfilePic(ec.new_photo);
    }

    ec.closeEditPhotoModal = function(){
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
            && ec.IP && ec.degree, ec.civil_status
        ) {

          ec.updatingPrimaryDetails = true;

          let primary_scholar_details = {
            scholar_id: ec.binded_copy.scholar_id,
            student_id_number: ec.student_id_number.toUpperCase(),
            degree: ec.degree,
            firstname: ec.firstname.toUpperCase(),
            lastname: ec.lastname.toUpperCase(),
            suffix: ec.suffix === 'NONE'? null : ec.suffix.toUpperCase(),
            middlename: ec.middlename.toUpperCase(),
            addressId: ec.addressId,
            date_of_birth: ec.date_of_birth,
            age: ec.age,
            gender: ec.gender,
            schoolId: ec.schoolId,
            courseId: ec.courseId,
            section: ec.section.toUpperCase(),
            year_level: ec.year_level,
            civil_status: ec.civil_status,
            IP: ec.IP
          }

          scholarApiService.validateScholarName(primary_scholar_details).then(response => {
            showSupervisorsApproval(primary_scholar_details, 'updatingPrimaryDetails', updateScholarDetails, response.data.exist, response.data.message);
          }, err =>{
            console.log(err);
          });
      }
      else{
          swalert.toastInfo('please complete the form', 'error', 'top-right');
      }
    }

    ec.updateScholarParentsDetails = function(){

      if (ec.m_firstname && ec.search_maidenname) {

        ec.updatingParentsDetails = true;
        
        let parentsDetails = {
          scholar_id: ec.copy.scholar_id,
          father_details:{ 
              firstname: (ec.f_firstname || "").toUpperCase(),
              lastname: (ec.search_flastname || "").toUpperCase(),
              middlename: (ec.f_middlename || "").toUpperCase(),
              suffix: ec.father_suffix === 'NONE'? null : ec.father_suffix.toUpperCase(),
              occupation: (ec.f_occupation || "").toUpperCase(),
          },
          mother_details:{ 
              firstname: ec.m_firstname.toUpperCase(), 
              maiden_name: ec.search_maidenname.toUpperCase(), 
              middlename: (ec.m_middlename || "").toUpperCase(), 
              occupation: (ec.m_occupation || "").toUpperCase(),
          },
        }

        showSupervisorsApproval(parentsDetails, 'updatingParentsDetails', updateScholarParentsDetails);
      }
      else{
          swalert.toastInfo('Mother details is required', 'error', 'top-right');
      }
    }

    ec.close = function(){
      ec.checkbox = false;
      ec.primaryDetailsForm.$setPristine();
      ec.parentsDetailsForm.$setPristine();
    	$scope.scholar = undefined;
   	  $mdSidenav('editScholar').toggle();
      ec.primary_details = false;
      ec.parents_details = false;
      ec.enablePrimaryButtonText = 'Enable';
      ec.enableParentsButtonText = 'Enable';
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

    ec.motherSearchQuery = function(searched){
      if (searched != ec.copy.mother_details.maiden_name) {
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
      ec.coursename = '';
      ec.courses = [];
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
        ec.binded_copy.updated_at = response.data;
        updatePrimaryDetails(scholarDetails);
        ec.updating = false;
        ec.updatingPrimaryDetails = false;
        ec.primary_details = false;
        swalert.dialogBox('Scholar updated!', 'success', 'Success');
        ec.primaryDetailsForm.$setPristine();
      }, err => {
        ec.updating = false;
        ec.updatingPrimaryDetails = false;
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    }

    function updateScholarParentsDetails(parentsDetails){
      scholarApiService.updateScholarParentsDetails(parentsDetails).then(response => {
        console.log(response);
        ec.binded_copy.father_details = response.data.father_details;
        ec.binded_copy.mother_details = response.data.mother_details;
        ec.binded_copy.updated_at = response.data.updated_at;
        ec.updating = false;
        ec.updatingParentsDetails = false;
        ec.parents_details = false;
        swalert.dialogBox('Parents details updated!', 'success', 'Success');
        ec.parentsDetailsForm.$setPristine();
      }, err => {
        console.log(err);
        ec.updating = false;
        ec.updatingParentsDetails = false;
        swalert.dialogBox(err.data.message, 'error', 'Failed');
      });
    }

    function uploadProfilePic(image){
      scholarApiService.uploadProfilePic(image).then(response => {
        console.log(response);
        ec.image_selected = false;
        ec.photo = response.data;
        ec.binded_copy.photo = response.data;
        ec.updating = false;
        ec.updatePhotoBtnText = 'Update';
        swalert.dialogBox('Photo updated', 'success', 'Success');
      }, err => {
        console.log(err);
        swalert.dialogBox(err.data, 'error', 'Success');
      });
    }

    function fillEditScholar(scholar){
        console.log(scholar);
        ec.binded_copy = scholar;
        let father = typeof scholar.father_details === 'object'? scholar.father_details : JSON.parse(scholar.father_details);
        let mother = typeof scholar.mother_details === 'object'? scholar.mother_details : JSON.parse(scholar.mother_details);
        ec.icon = (scholar.degree === 'Masters' || scholar.degree === 'Doctorate')  ? 'school' : 'groups';
        ec.newaddress = $filter('formatAddress')(scholar.address);

        //primary
        ec.photo = scholar.photo;
        ec.scholar_id = scholar.scholar_id;
        ec.student_id_number = scholar.student_id_number;
        ec.degree = scholar.degree;
        ec.firstname = scholar.firstname;
        ec.lastname = scholar.lastname;
        ec.suffix = scholar.suffix ? scholar.suffix : 'NONE';
        ec.middlename =  scholar.middlename;
        ec.addressId =  scholar.addressId;
        ec.date_of_birth =  scholar.date_of_birth;
        ec.age =  scholar.age;
        ec.gender =  scholar.gender;
        ec.schoolId =  scholar.schoolId;
        ec.school_name = scholar.school.school_name;
        ec.courseId =  scholar.courseId;
        ec.course = scholar.course.course;
        ec.section =  scholar.section;
        ec.year_level =  scholar.year_level;
        ec.civil_status =  scholar.civil_status;
        ec.IP =  scholar.IP;
        ec.academic_year = scholar.academicyear_semester_contract.academic_year;
        ec.semester = scholar.academicyear_semester_contract.semester;

        // parents
        ec.search_flastname = father.lastname;
        ec.f_firstname = father.firstname;
        ec.f_middlename = father.middlename;
        ec.father_suffix = father.suffix ? father.suffix : 'NONE';
        ec.search_maidenname = mother.maiden_name;
        ec.m_firstname = mother.firstname;
        ec.m_middlename = mother.middlename;
        ec.degree = scholar.degree;
        ec.f_occupation = father.occupation;
        ec.m_occupation = mother.occupation;
    }

    function updatePrimaryDetails(primay){
      
      if(ec.addressObj){
        primay['address'] = ec.addressObj;
      }

      if(ec.schoolObj){
        primay['school'] = ec.schoolObj;
      }

      if(ec.courseObj){
        primay['course'] = ec.courseObj;
      }

      let keys = Object.keys(primay);
      for(let i=0; i < keys.length; i++){
        ec.binded_copy[keys[i]] = primay[keys[i]];
      }
      console.log(ec.binded_copy);
    }

    function runIfHasScholar(){
      $scope.$watch('ec.schoolname', function(n, o){
        if (n) {
          addScholarsService.getListOfSchool({searched_school: n}).then(response=>{
            ec.schools = response;
          }, err=>{
            console.log(err);
          });
        }
      });

      $scope.$watch('ec.addressname', function(n, o){
        if (n) {
          addScholarsService.getAddresses(n).then(response=>{
            ec.addresses = response;
          }, err=>{
            console.log(err);
          });
        }
      });

      $scope.$watch('ec.coursename', function(n, o){
        if (n) {
          addScholarsService.getCourses({ searched: n, degree: JSON.stringify([ec.degree]) }).then(response=>{
            ec.courses = response;
          }, err=>{
            console.log(err);
          });
        }
      });
    }

    async function showSupervisorsApproval(details, updating, method, exist = false, message = "", ){
      
      async function superVisor(){
        const result = await swalert.supervisorsApproval();
        if (result.isConfirmed) {
          ec.updating = true;
          method(details);
        }
        if(result.isDismissed){
          ec[updating] = false;
          $scope.$apply(ec[updating]);
        }
      }
      
      if(exist){
        const proceed = await swalert.promptMessageForSupervisor(message,  'error', 'Scholar name exist', true);
        if (proceed.isConfirmed) {
          superVisor();
        }
        if(proceed.isDismissed){
          ec[updating] = false;
          $scope.$apply(ec[updating]);
        }
      }
      else
      {
        superVisor();
      }
      
    }

    ec.resizeImage = function (settings) {
      var file = settings.file;
      var maxSize = settings.maxSize;
      var reader = new FileReader();
      var image = new Image();
      var canvas = document.createElement('canvas');
      
      var dataURItoBlob = function (dataURI) {
          var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
              atob(dataURI.split(',')[1]) :
              unescape(dataURI.split(',')[1]);
          var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var max = bytes.length;
          var ia = new Uint8Array(max);
          for (var i = 0; i < max; i++)
              ia[i] = bytes.charCodeAt(i);
          return new File([ia], file.name, { type: mime });
      };
      
      var resize = function () {
          var width = image.width;
          var height = image.height;
          if (width > height) {
              if (width > maxSize) {
                  height *= maxSize / width;
                  width = maxSize;
              }
          } else {
              if (height > maxSize) {
                  width *= maxSize / height;
                  height = maxSize;
              }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          var dataUrl = canvas.toDataURL('image/jpeg');
          return { newfile: dataURItoBlob(dataUrl), dataurl: dataUrl };
      };

      return new Promise(function (resolve, reject) {
          if (!file.type.match(/image.*/)) {
              reject(new Error("Not an image"));
              return;
          }
          reader.onload = function (readerEvent) {
              image.onload = function () { 
                return resolve(resize());
              };
              image.src = readerEvent.target.result;
          };
          reader.readAsDataURL(file);
      });
    };

    function loadSuffix(){
      addScholarsService.getSuffix().then(response => {
        console.log(response);
        ec.suffix_list = response.data;
      }, err => {
        console.log(err);
      });
    }

    loadSuffix();

}]);
