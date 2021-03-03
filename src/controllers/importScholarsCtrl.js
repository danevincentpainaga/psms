'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:importScholarsCtrl
 * @description
 * # importScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('importScholarsCtrl',['$scope', '$q', '$mdSidenav', 'importScholarApiService', 'municipalitiesApiService', 'schoolApiService', 'scholarApiService', 'courseApiService', 'academicContractService', 'addScholarsService', 'moment', '$timeout', 'swalert', 'uiGridConstants',
  function ($scope, $q, $mdSidenav, importScholarApiService, municipalitiesApiService, schoolApiService, scholarApiService, courseApiService, academicContractService, addScholarsService, moment, $timeout, swalert, uiGridConstants) {

  var ic = this;
  var year_level = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  var scholar_status = ['NEW', 'OLD'];
  var ip = ['YES', 'NO'];
  var gender = ['Male', 'Female'];
  ic.total_errors = 0;

  // ic.myData = [];
  ic.scholars_to_upload = [];
  ic.progress_value = 0;

  ic.gridOptions = {
    enableColumnResizing: true,
    enableGridMenu: true,
    data: [],
    importerDataAddCallback: function ( grid, newObjects ) {

      // ic.myData = ic.myData.concat( newObjects );
      // ic.gridOptions.data = ic.myData;
      // console.log(newObjects);
    },
    columnDefs: [
      { field: 'index', displayName: 'NO.', field: 'number', width: '50', enableFiltering: false, enableSorting: false, cellClass: 'row-no',  cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
      { displayName: 'Error', field: 'error', width: '15%', 
        cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
          let error = grid.getCellValue(row,col);
          if (error && error.length > 0) {
            return 'error';
          }
        }
      },
      { field: 'Lastname', width: '15%'},
      { field: 'Firstname', width: '15%' },
      { field: 'Middlename', width: '15%' },
      { field: 'Date of Birth', width: '15%' },
      { field: 'Age', width: '15%' },
      { field: 'Gender', width: '15%' },
      { field:'Address', width: '30%'},
      { field:'Father_lastname', width: '30%' },
      { field:'Father_firstname', width: '30%' },
      { field:'Father_middlename', width: '30%' },
      { field:'Mother_maiden_name', width: '30%' },
      { field:'Mother_firstname', width: '30%' },
      { field:'Mother_middlename', width: '30%' },
      { field:'School',  width: '30%' },
      { field:'Degree',  width: '30%' },
      { field:'Student ID NO',  width: '15%' },
      { field:'Course',  width: '30%' },
      { field:'Section',  width: '30%' },
      { field:'Year level', width: '15%' },
      { field:'Semester',width: '15%' },
      { field:'Academic year', width: '15%' },
      { field:'Status',  width: '10%' },
      { displayName: 'IP', field:'IP', width: '10%' },
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterCsvFilename: 'Imported_scholars.csv',
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    exporterExcelFilename: 'Imported_scholars.xlsx',
    exporterExcelSheetName: 'Scholars',
    onRegisterApi: function(gridApi){
      ic.gridApi = gridApi;
    }
  };

  ic.add = function(){
    $mdSidenav('importScholars').toggle();
  }

  ic.uploadToDatabase = function(){
    ic.checking_in = 'Uploading...';
    console.log(ic.scholars_to_upload);

    importScholarApiService.importScholars(ic.scholars_to_upload).then(response =>{
      swalert.dialogBox('Import successful!', 'success', 'Success');
      console.log(response.data);
    }, err => {
      console.log(err);
    });

  }

  function getMunicipalities(){
    municipalitiesApiService.getMunicipalities()
      .then(response=>{
        ic.municipalities = response.data;
        ic.municipalities_loaded = true;
      }, err=> {
        console.log(err);
      });
  }

  ic.checkImportedScholars = function(){

      ic.show_spinner = true;

      let checkedItem = [];

      ic.imported_scholars = angular.copy(ic.gridOptions.data);
      
      console.log("checking... ");

      $timeout(()=>{

        ic.checking_in = "Duplicate values";

        ic.imported_scholars.forEach(function(value, idx){

          ic.gridOptions.data[idx].error = [];

          if (checkedItem.indexOf(concatAndLower(value)) > -1) return;

          checkedItem.push(concatAndLower(value));

          checkDuplicate(value, ic.imported_scholars, idx);

        });

        validateImportedScholars();

      });

      // checkDuplicate(imported_scholars, 0); 
  }

  ic.cancel = function(){
    $mdSidenav('importScholars').toggle();
  }

  // This code removes Duplicate Names with row NO. of Duplicates

  // function checkDuplicate(imported_scholars, idx){

  //   if (idx >= imported_scholars.length - 1) {
  //     ic.gridOptions.data = imported_scholars;
  //     return;
  //   }

  //   var result = check(imported_scholars, idx);


  //   idx++;

  //   checkDuplicate(result, idx);

  // }

  // function check(imported_scholars, idx){
  //   for (var i = 0; i < imported_scholars.length; i++) {

  //     if (imported_scholars[idx].number !== imported_scholars[i].number) {
  //       if (concatAndLower(imported_scholars[idx]) === concatAndLower(imported_scholars[i]))  {
  //         imported_scholars[idx].error[0] = "Duplicate No.";
  //         imported_scholars[idx].error.push(imported_scholars[i].number);
  //         imported_scholars.splice(i, 1);
  //       }
  //     }

  //   }

  //   return imported_scholars;
  // }

  function checkDuplicate(value, imported_scholars, idx){
    for (var i = 0; i < imported_scholars.length; i++) {
      if (idx !== i) {
        if (concatAndLower(value) === concatAndLower(imported_scholars[i]))  {
          ic.gridOptions.data[idx].error[0] = "Duplicate No.";
          ic.gridOptions.data[idx].error.push(i+1);
          ic.total_errors += 1;
        }
      }
    }
  }

  function concatAndLower(value){
    return (value.Firstname+value.Lastname+value.Middlename).replace(/ |,/g,'').trim().toLowerCase();
  }

  function validateImportedScholars(){
      $q.all([importScholarApiService.getAllScholars({degree: ic.degree}), importScholarApiService.getAddresses({municipality: ic.municipality}), schoolApiService.getListOfSchool(), courseApiService.getCourses(), academicContractService.getAcademicContractDetails()]).then(response=>{
        
        console.log(response);
        $mdSidenav('importScholars').toggle();

        ic.imported_scholars.forEach(function(val, i){
          $timeout(()=>{
            validateScholarsName(response, val, i);
            if (i === ic.imported_scholars.length -1) {
              ic.checking_in = 'Finished';
              ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            }
          });

        });

      }, err=> {
        console.log(err);
      });
  }

  function validateScholarsName(response, scholarsObj, idx){

      ic.show_spinner = false;

      var total = ic.imported_scholars.length - 1;

      ic.checking_in = scholarsObj.Lastname+" "+scholarsObj.Firstname+", "+scholarsObj.Middlename;

      const result = response[0].data.find(item => {

        if (item.lastname.trim().toLowerCase() === scholarsObj.Lastname.trim().toLowerCase() && item.firstname.trim().toLowerCase() === scholarsObj.Firstname.trim().toLowerCase() && item.middlename.trim().toLowerCase() === scholarsObj.Middlename.trim().toLowerCase()) {
            ic.gridOptions.data[idx].error.push("Error: Scholar already exist");
            ic.total_errors += 1;
            return true;
        }

      });

      if (result) {

        ic.progress_value = Math.round(idx / total * 100);

        return;

      }

      validate(scholar_status, scholarsObj.Status, "Error: Invalid status", idx);
      validate(ip, scholarsObj.IP, "Error: Invalid IP", idx);
      validate(year_level, scholarsObj['Year level'], "Error: Invalid Year level", idx);
      validate(gender, scholarsObj.Gender, "Error: Invalid Gender", idx);

      if (!scholarsObj.Degree || upperCase(scholarsObj.Degree) !== upperCase(ic.degree)) {
          ic.gridOptions.data[idx].error.push("Error: Degree is Invalid");
          ic.total_errors += 1;
      }

      if (!scholarsObj.Section) {
          ic.gridOptions.data[idx].error.push("Error: Section is required");
          ic.total_errors += 1;
      }

      if (!moment.validateDate(scholarsObj['Date of Birth'])) {
          ic.gridOptions.data[idx].error.push("Error: Invalid Date of Birth");
          ic.total_errors += 1;
      }

      if (!scholarsObj.Mother_maiden_name && !scholarsObj.Mother_firstname && !scholarsObj.Mother_middlename ) {
          ic.gridOptions.data[idx].error.push("Error: Mother's details is required");
          ic.total_errors += 1;
      }

      validateAddress(response[1].data, scholarsObj, idx);
      validateSchool(response[2].data, scholarsObj, idx);
      validateCourse(response[3].data, scholarsObj, idx);
      validateContractDetails(response[4].data, scholarsObj, idx);

      ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );

      let scholar = {
          student_id_number: upperCase(scholarsObj['Student ID NO']),
          lastname: upperCase(scholarsObj.Lastname),
          firstname: upperCase(scholarsObj.Firstname),
          middlename: upperCase(scholarsObj.Middlename),
          addressId: scholarsObj.Address,
          date_of_birth: scholarsObj['Date of Birth'],
          age: addScholarsService.calcAge(scholarsObj['Date of Birth']),
          gender: scholarsObj.Gender,
          schoolId: scholarsObj.School,
          courseId: scholarsObj.Course,
          section: upperCase(scholarsObj.Section),
          year_level: scholarsObj['Year level'],
          IP: scholarsObj.IP,
          father_details:{ 
              firstname: upperCase((scholarsObj.Father_firstname || "")),
              lastname: upperCase((scholarsObj.Father_lastname || "")),
              middlename: upperCase((scholarsObj.Father_middlename || "")),
          },
          mother_details:{ 
              firstname: upperCase((scholarsObj.Mother_firstname)), 
              maiden_name: upperCase((scholarsObj.Mother_maiden_name)), 
              middlename: upperCase((scholarsObj.Mother_middlename)), 
          },
          degree: scholarsObj.Degree,
          scholar_status: scholarsObj.Status,
          contract_id: scholarsObj.contract_id
      };

      ic.scholars_to_upload.push(scholar);

      ic.progress_value = Math.round(idx / total * 100);
  }

  function upperCase(value){
    if (value){
      return value.toUpperCase();
    } 
    return value;
  }

  function validate(referenceArray, fieldname, error, idx){
    if (referenceArray.indexOf(fieldname) === -1) {
        ic.gridOptions.data[idx].error.push(error);
        ic.total_errors += 1;
    }   
  }

  function validateAddress(addressesArray, scholarsObj, idx){

      console.log("Address checking... ");

      const address = addressesArray.find(item => {
        if (item.address.replace(/ |,/g,'').toLowerCase() === scholarsObj.Address.replace(/ |,/g,'').toLowerCase()) {
            scholarsObj.Address = item.address_id;
            return true;
        }
      });

      if (!address) {
        ic.gridOptions.data[idx].error.push("Error: Address "+scholarsObj.Address+" does not exist in database ");
        ic.total_errors += 1;
      }

  }

  function validateSchool(schoolsArray, scholarsObj, idx){

      console.log("School checking...");

      const school = schoolsArray.find(item => {
        if (item.school_name.replace(/ |,/g,'').toLowerCase() === scholarsObj.School.replace(/ |,/g,'').toLowerCase()) {
            scholarsObj.School = item.school_id;
            return true;
        }
      });

      if (!school) {
          ic.gridOptions.data[idx].error.push("Error: School "+scholarsObj.School+" does not exist in database ");
          ic.total_errors += 1;
      }

  }

  function validateCourse(coursesArray, scholarsObj, idx){

      console.log("Course checking...");

      const course = coursesArray.find(item => {
        if (item.course.replace(/ |,/g,'').toLowerCase() === scholarsObj.Course.replace(/ |,/g,'').toLowerCase()) {
            scholarsObj.Course = item.course_id;
            return true;
        }
      });

      if (!course) {
        ic.gridOptions.data[idx].error.push("Error: Course "+scholarsObj.Course+" does not exist in database ");
        ic.total_errors += 1;
      }

  }

  function validateContractDetails(contractDetailsArray, scholarsObj, idx){

      console.log("Contract checking...");

      const contract = contractDetailsArray.find(item => {
        if (item.academic_year_semester.semester.trim() === scholarsObj.Semester.trim() && item.academic_year_semester.academic_year.trim() === scholarsObj['Academic year'].trim()) {
            scholarsObj.contract_id = item.ascId;
            return true;
        }
      });

      if (!contract) {
        ic.gridOptions.data[idx].error.push("Error: Academic year semester Invalid");
        ic.total_errors += 1;
      }

  }

  getMunicipalities();

}]);