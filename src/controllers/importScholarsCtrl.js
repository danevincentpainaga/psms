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

  $scope.$watchGroup(['ic.degree', 'ic.municipality'], function(n, o){
    ic.selection_complete = n.indexOf(undefined) === -1 ? true : false;
  });

  $scope.$watch('ic.isOpen', function(isOpen) {
    if (isOpen) {
      $timeout(function() { ic.tooltipVisible = ic.isOpen; }, 500);
    } else {
      ic.tooltipVisible = ic.isOpen;
    }
  });

  // ic.myData = [];
  ic.scholars_to_upload = [];
  ic.progress_value = 0;
  ic.importBtn = 'Import to database';

  ic.gridOptions = {
    enableFiltering: false,
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
      { displayName: 'Error', field: 'error', width: '15%', enableFiltering: false,
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

      ic.gridApi.pinning.on.columnPinned($scope, function (colDef, container) {
        if (!container) {
          colDef.visible = false;
          ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          $timeout(function () {
            colDef.visible = true;
            ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          });
        }
      });
      
    }
  };

  ic.toggleFiltering = function(){
    ic.gridOptions.enableFiltering = !ic.gridOptions.enableFiltering;
    ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };

  ic.add = function(){
    $mdSidenav('importScholars').toggle();
  }

  ic.cancel = function(){
    ic.scholars_to_upload = [];
    ic.check_fininshed = false;
    ic.gridOptions.data = [];
    ic.progress_value = 0;
    ic.total_errors = 0;
    ic.isChecking = false;
    ic.degree = undefined;
    ic.municipality = undefined;
    ic.importBtn = 'Import to database';
    $mdSidenav('importScholars').toggle();
  }

  ic.importToDatabase = function(){

    if (ic.total_errors > 0) {
      swalert.dialogBox('Imported data has '+ ic.total_errors +' Errors', 'error', 'Cannot import');
      return;
    }

    let imported_data = {
      scholars: ic.scholars_to_upload,
      error: ic.total_errors
    };

    swalert.confirm(imported_data, importScholarsData, 'Proceed to import?', 'You can\'t cancel once imported.', 'warning', 500, ic);

  }

  ic.checkImportedScholars = function(){

      ic.circular_message = 'Processing';
      ic.show_spinner = true;
      ic.isChecking = true;
      let checkedItem = [];
      ic.imported_scholars = angular.copy(ic.gridOptions.data);

      $timeout(()=>{

        ic.checking_in = "Duplicate values";

        ic.imported_scholars.forEach(function(value, idx){

          ic.gridOptions.data[idx].error = [];

          if (checkedItem.indexOf(concatAndLower(value)) > -1) return;

          if (concatAndLower(value) === undefined) {
            ic.gridOptions.data[idx].error.push("Error: Empty scholar name");
            ic.total_errors += 1;
            return;
          }

          checkedItem.push(concatAndLower(value));

          checkDuplicate(value, ic.imported_scholars, idx);

        });

        validateImportedScholars();

      });

      // checkDuplicate(imported_scholars, 0); 
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
      matchDuplicate(value, imported_scholars[i], idx, i);
    }
  }

  function matchDuplicate(value, imported_scholars, idx, i){
    if (idx === i) return;
    if (concatAndLower(value) === concatAndLower(imported_scholars))  {
      ic.gridOptions.data[idx].error[0] = "Duplicate No.";
      ic.gridOptions.data[idx].error.push(i+1);
      ic.total_errors += 1;
    }
  }

  function validateImportedScholars(){
      $q.all([importScholarApiService.getAllScholars({degree: ic.degree}), importScholarApiService.getAddresses({municipality: ic.municipality}), schoolApiService.getListOfSchool(), courseApiService.getCourses(), academicContractService.getAcademicContractDetails()]).then(response=>{
        
        $mdSidenav('importScholars').toggle();

        ic.imported_scholars.forEach(function(val, i){
          $timeout(()=>{
            validateScholarsName(response, val, i);
            if (i === ic.imported_scholars.length -1) {
              ic.progress_value = 100;
              ic.checking_in = 'Finished';
              ic.check_fininshed = true;
              ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
              swalert.toastInfo('Check Finished', 'success', 'top-right');
            }
          });
        });

      }, err=> {
        console.log(err);
      });
  }

  function validateScholarsName(response, scholarsObj, idx){

      if (!ic.isChecking) return;

      var total = ic.imported_scholars.length - 1;

      ic.show_spinner = false;

      if (!scholarsObj.Lastname || !scholarsObj.Firstname || !scholarsObj.Middlename) {
        ic.progress_value = Math.ceil(idx / total * 100) -1;
        return;
      };

      ic.checking_in = scholarsObj.Lastname+" "+scholarsObj.Firstname+", "+scholarsObj.Middlename;

      validateLettersSpaces(scholarsObj.Lastname, "Lastname", idx);
      validateLettersSpaces(scholarsObj.Firstname, "Firstname", idx);
      validateLettersSpaces(scholarsObj.Middlename, "Middlename", idx);

      const result = response[0].data.find(item => {

        if (trimAndLower(item.lastname) === trimAndLower(scholarsObj.Lastname) && trimAndLower(item.firstname) === trimAndLower(scholarsObj.Firstname) && trimAndLower(item.middlename) === trimAndLower(scholarsObj.Middlename)) {
            ic.gridOptions.data[idx].error.push("Error: Scholar already exist");
            ic.total_errors += 1;
            return true;
        }

      });

      if (result) {
        ic.progress_value = Math.ceil(idx / total * 100) -1;
        return;
      }

      validate(scholar_status, scholarsObj.Status, "Error: Invalid status", idx);
      validate(ip, scholarsObj.IP, "Error: Invalid IP", idx);
      validate(year_level, scholarsObj['Year level'], "Error: Invalid Year level", idx);
      validate(gender, scholarsObj.Gender, "Error: Invalid Gender", idx);

      validateFather(scholarsObj, idx);
      validateMother(scholarsObj, idx);

      validateAddress(response[1].data, scholarsObj, idx);
      validateSchool(response[2].data, scholarsObj, idx);
      validateCourse(response[3].data, scholarsObj, idx);
      validateContractDetails(response[4].data, scholarsObj, idx);

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

      let fdetails = {
          firstname: upperCase((scholarsObj.Father_firstname || "")),
          lastname: upperCase((scholarsObj.Father_lastname || "")),
          middlename: upperCase((scholarsObj.Father_middlename || "")),
      };
      let mdetails = { 
          firstname: upperCase((scholarsObj.Mother_firstname)), 
          maiden_name: upperCase((scholarsObj.Mother_maiden_name)), 
          middlename: upperCase((scholarsObj.Mother_middlename)), 
      };

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
          father_details: JSON.stringify(fdetails),
          mother_details: JSON.stringify(mdetails),
          degree: scholarsObj.Degree,
          scholar_status: scholarsObj.Status,
          contract_id: scholarsObj.contract_id
      };

      ic.scholars_to_upload.push(scholar);

      ic.progress_value = Math.ceil(idx / total * 100) -1;

  }

  function validateAddress(addressesArray, scholarsObj, idx){
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

  function upperCase(value){
    if (typeof value === 'string'){
      return value.toUpperCase();
    } 
    return value;
  }

  function validateFather(scholarsObj, idx){

    if (!scholarsObj.Father_lastname && !scholarsObj.Father_firstname && !scholarsObj.Father_middlename ) return;

    if (scholarsObj.Father_lastname && scholarsObj.Father_firstname) {
      validateLettersSpaces(scholarsObj.Father_lastname, "Father_lastname", idx);
      validateLettersSpaces(scholarsObj.Father_firstname, "Father_firstname", idx);
      validateLettersSpaces(scholarsObj.Father_middlename, "Father_middlename", idx);
    }
    else{
      ic.gridOptions.data[idx].error.push("Error: Incomplete Father details");
      ic.total_errors += 1;
      return;
    }
  }

  function validateMother(scholarsObj, idx){
    if (!scholarsObj.Mother_maiden_name || !scholarsObj.Mother_firstname || !scholarsObj.Mother_middlename) {
      ic.gridOptions.data[idx].error.push("Error: Mother details is required");
      ic.total_errors += 1;
      return;
    }

    validateLettersSpaces(scholarsObj.Mother_maiden_name, "Mother_maiden_name", idx);
    validateLettersSpaces(scholarsObj.Mother_firstname, "Mother_firstname", idx);
    validateLettersSpaces(scholarsObj.Mother_middlename, "Mother_middlename", idx);

  }

  function validateLettersSpaces(value, value_name, idx){

    if (value_name === 'Father_middlename' && value === undefined) return;

    let midname = ['Mother_middlename', 'Middlename'];

    let str = value.toString().trim();

    if (str.toLowerCase() === "none" && midname.indexOf(value_name) > -1) return;

    if (!str || !/^[a-zA-Z\s]+$/.test(str) || str.toLowerCase() === "none") {
      ic.gridOptions.data[idx].error.push("Error: Invalid "+value_name+" "+value);
      ic.total_errors += 1;
    }
  }

  function validate(referenceArray, fieldname, error, idx){
    if (referenceArray.indexOf(fieldname) === -1) {
        ic.gridOptions.data[idx].error.push(error);
        ic.total_errors += 1;
    }   
  }

  function concatAndLower(value){
    if (!value.Firstname || !value.Lastname || !value.Middlename) return undefined;
    return (value.Firstname+value.Lastname+value.Middlename).replace(/ |,/g,'').trim().toLowerCase();
  }

  function trimAndLower(value){
    return (value || "").toString().trim().toLowerCase()
  }

  function importScholarsData(imported_data){
    importScholarApiService.importScholars(imported_data).then(response =>{
      swalert.dialogBox('Import successful!', 'success', 'Success');
      ic.show_spinner = false;
    }, err => {
      console.log(err);
      swalert.dialogBox(err.data.message, 'error', 'Failed');
      ic.show_spinner = false;
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

  getMunicipalities();

}]);