'use strict';

const { result } = require("lodash");

/**
 * @ngdoc function
 * @name psmsApp.controller:importScholarsCtrl
 * @description
 * # importScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
  app.controller('importScholarsCtrl',
    [
      '$scope',
      '$q',
      '$mdSidenav',
      'importScholarApiService',
      'municipalitiesApiService',
      'schoolApiService',
      'scholarApiService',
      'courseApiService',
      'academicContractService',
      'addScholarsService',
      'moment',
      '$timeout',
      'swalert',
      'uiGridConstants',
    function (
      $scope,
      $q,
      $mdSidenav,
      importScholarApiService,
      municipalitiesApiService,
      schoolApiService,
      scholarApiService,
      courseApiService,
      academicContractService,
      addScholarsService,
      moment,
      $timeout,
      swalert,
      uiGridConstants
    ) {

  var ic = this;
  var year_level = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  var scholar_status = ['NEW', 'OLD'];
  var ip = ['YES', 'NO'];
  var gender = ['Male', 'Female'];
  var page = 0;
  var scholar_count = 0;
  ic.total_errors = 0;

  $scope.$watchGroup(['ic.degree', 'ic.municipality'], function(n, o){
    ic.selection_complete = n.indexOf(undefined) === -1 ? true : false;
  });

  $scope.$watch('ic.isOpen', function(isOpen) {
    if (isOpen) {
      $timeout(function() { ic.tooltipVisible = ic.isOpen; }, 300);
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
      { displayName: 'NO.', field: 'index', width: '50', enableFiltering: false, enableSorting: false, cellClass: 'row-no',  cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
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
      { field: 'Date of Birth', width: '10%' },
      { field: 'Age', width: '5%' },
      { field: 'Gender', width: '10%' },
      { field:'Address', width: '20%'},
      { field:'Father_lastname', displayName: 'Father_lastname', width: '15%' },
      { field:'Father_firstname', displayName: 'Father_firstname', width: '15%' },
      { field:'Father_middlename', displayName: 'Father_middlename', width: '15%' },
      { field:'Mother_maiden_name', displayName: 'Mother_maiden_name', width: '15%' },
      { field:'Mother_firstname', displayName: 'Mother_firstname', width: '15%' },
      { field:'Mother_middlename', displayName: 'Mother_middlename', width: '15%' },
      { field:'School',  width: '20%' },
      { field:'Degree',  width: '10%' },
      { field:'Student ID NO', displayName: 'Student ID NO', width: '10%' },
      { field:'Course',  width: '25%' },
      { field:'Section',  width: '10%' },
      { field:'Year level', width: '10%' },
      { field:'Semester',width: '10%' },
      { field:'Academic year', width: '10%' },
      { field:'Status',  width: '10%' },
      { displayName: 'IP', field:'IP', width: '7%' },
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LEGAL',
    exporterPdfDefaultStyle: {fontSize: 7},
    exporterPdfTableStyle: {margin: [-30, -30, 0, 0], fontSize: 7 },
    exporterPdfMaxGridWidth: 765,
    exporterPdfTableHeaderStyle: {fontSize: 7, bold: true, italics: true, color: 'red'},
    exporterCsvFilename: 'Scholars list.csv',
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    exporterExcelFilename: 'Scholars list.xlsx',
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

  ic.close = function(){
    $mdSidenav('importScholars').toggle();
  }

  ic.cancel = function(){
    ic.scholars_to_upload = [];
    ic.check_finished = false;
    ic.gridOptions.data = [];
    ic.progress_value = 0;
    ic.total_errors = 0;
    ic.isChecking = false;
    ic.degree = undefined;
    ic.municipality = undefined;
    ic.importBtn = 'Import to database';
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

          if (!value.Firstname && !value.Lastname && !value.Middlename) {
            addError("Error: Empty scholar name", idx);
            return;
          }
          
          let fname = validateLettersSpaces(value.Firstname, "Firstname", idx);
          let lname = validateLettersSpaces(value.Lastname, "Lastname", idx);
          let mname = validateLettersSpaces(value.Middlename, "Middlename", idx);

          if (fname || lname || mname) {
            console.log('Hit');
            return;
          }
          let mother_middlename = value.Mother_middlename? value.Mother_middlename : "";
          let middlename = value.Middlename? value.Middlename : "";
          let row = (value.Firstname+value.Lastname+middlename+value.Mother_firstname+value.Mother_maiden_name+value.Mother_middlename).toLowerCase();

          if (checkedItem.indexOf(row) > -1) return;

          // if (concatAndLower(value) === undefined) {
          //   ic.gridOptions.data[idx].error.push("Error: Empty scholar name");
          //   ic.total_errors += 1;
          //   return;
          // }

          // checkedItem.push(concatAndLower(value));
          checkedItem.push(row);

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
      // $q.all([importScholarApiService.getScholarsWithCount({degree: ic.degree}), importScholarApiService.getAddresses({municipality: ic.municipality}), schoolApiService.getListOfSchool(), importScholarApiService.getCourses({degree: ic.degree}), academicContractService.getAcademicContractDetails()]).then(response=>{
      $q.all([importScholarApiService.getAddresses({municipality: ic.municipality}), schoolApiService.getListOfSchool(), importScholarApiService.getCourses({degree: ic.degree}), academicContractService.getAcademicContractDetails()]).then(response=>{
        console.log(response);

        $mdSidenav('importScholars').toggle();

        ic.imported_scholars.forEach(function(val, i){
          $timeout(()=>{
            validateScholarsName(response, val, i);
            if (i === ic.imported_scholars.length -1) {
              // ic.progress_value = 0;
              checkIfScholarExist();
              // ic.checking_in = 'Finished';
              // ic.check_finished = true;
              ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
              // swalert.toastInfo('Check Finished', 'success', 'top-right');
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

      if (!scholarsObj.Lastname || !scholarsObj.Firstname) {
        ic.progress_value = Math.ceil(idx / total * 100) -1;
        return;
      };

      ic.checking_in = scholarsObj.Lastname+" "+scholarsObj.Firstname+", "+scholarsObj.Middlename;

      // validateLettersSpaces(scholarsObj.Lastname, "Lastname", idx);
      // validateLettersSpaces(scholarsObj.Firstname, "Firstname", idx);
      // validateLettersSpaces(scholarsObj.Middlename, "Middlename", idx);

      // const result = response[0].data.find(item => {

      //   if (trimAndLower(item.lastname) === trimAndLower(scholarsObj.Lastname) && trimAndLower(item.firstname) === trimAndLower(scholarsObj.Firstname) && trimAndLower(item.middlename) === trimAndLower(scholarsObj.Middlename)) {
      //       addError("Error: Scholar already exist", idx);
      //       return true;
      //   }

      // });

      // if (result) {
      //   ic.progress_value = Math.ceil(idx / total * 100) -1;
      //   return;
      // }

      validate(scholar_status, scholarsObj.Status, "Error: Invalid status", idx);
      validate(ip, scholarsObj.IP, "Error: Invalid IP", idx);
      validate(year_level, scholarsObj['Year level'], "Error: Invalid Year level", idx);
      validate(gender, scholarsObj.Gender, "Error: Invalid Gender", idx);

      validateFather(scholarsObj, idx);
      validateMother(scholarsObj, idx);

      validateAddress(response[0].data, scholarsObj, idx);
      validateSchool(response[1].data, scholarsObj, idx);
      validateCourse(response[2].data, scholarsObj, idx);
      validateContractDetails(response[3].data, scholarsObj, idx);

      if (!scholarsObj.Degree) {
        addError("Error: Degree is empty", idx);
      }

      if (scholarsObj.Degree && upperCase(scholarsObj.Degree) !== upperCase(ic.degree)) {
        addError("Error: Degree is Invalid", idx);
      }

      if (!scholarsObj.Section) {
        addError("Error: Section is empty", idx);
      }

      if (!scholarsObj['Date of Birth']) {
        addError("Error: Date of Birth is empty", idx);
      }

      if (scholarsObj['Date of Birth'] && !moment.validateDate(scholarsObj['Date of Birth'])) {
        addError("Error: Invalid Date of Birth", idx);
      }

      let fdetails = {
          firstname: upperCase((scholarsObj.Father_firstname || "")),
          lastname: upperCase((scholarsObj.Father_lastname || "")),
          middlename: upperCase((scholarsObj.Father_middlename || null)),
      };
      let mdetails = { 
          firstname: upperCase((scholarsObj.Mother_firstname)), 
          maiden_name: upperCase((scholarsObj.Mother_maiden_name)), 
          middlename: upperCase((scholarsObj.Mother_middlename || null)), 
      };

      let scholar = {
          student_id_number: upperCase(scholarsObj['Student ID NO']),
          lastname: upperCase(scholarsObj.Lastname),
          firstname: upperCase(scholarsObj.Firstname),
          middlename: upperCase(scholarsObj.Middlename || null),
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
    if (!scholarsObj.Address) {
      addError("Error: Address is empty", idx);
      return;
    }

    const address = addressesArray.find(item => {
      if ((item.address+item.municipality+'antique').replace(/ |,/g,'').toLowerCase() === scholarsObj.Address.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.Address = item.address_id;
          return true;
      }
    });

    if (!address) {
      addError("Error: Address "+scholarsObj.Address+" not found", idx);
    }
  }

  function validateSchool(schoolsArray, scholarsObj, idx){
    if (!scholarsObj.Address) {
      addError("Error: School is empty", idx);
      return;
    }

    const school = schoolsArray.find(item => {
      if (item.school_name.replace(/ |,/g,'').toLowerCase() === scholarsObj.School.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.School = item.school_id;
          return true;
      }
    });

    if (!school) {
      addError("Error: School "+scholarsObj.School+" not found", idx);
    }
  }

  function validateCourse(coursesArray, scholarsObj, idx){
    if (!scholarsObj.Course) {
      addError("Error: Course is empty", idx);
      return;
    }

    const course = coursesArray.find(item => {
      if (item.course.replace(/ |,/g,'').toLowerCase() === scholarsObj.Course.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.Course = item.course_id;
          return true;
      }
    });

    if (!course) {
      addError("Error: Course "+scholarsObj.Course+" not found", idx);
    }
  }

  function validateContractDetails(contractDetailsArray, scholarsObj, idx){

    let hasError;

    if (!scholarsObj.Semester) {
      addError("Error: Semester is empty", idx);
      hasError = true;
    }

    if (!scholarsObj['Academic year']) {
      addError("Error: Academic year is empty", idx);
      hasError = true; 
    }

    if (hasError) return;

    const contract = contractDetailsArray.find(item => {
      if (item.academic_year_semester.semester.trim() === scholarsObj.Semester.trim() && item.academic_year_semester.academic_year.trim() === scholarsObj['Academic year'].trim()) {
          scholarsObj.contract_id = item.ascId;
          return true;
      }
    });

    if (!contract) {
      addError("Error: Academic year semester Invalid", idx);
    }
  }

  function checkIfScholarExist(){
    importScholarApiService.getScholarsWithCount({ degree: ic.degree, page: page }).then(response => {
      console.log(response);
      const numberOfPages = Math.ceil(response.data.count / 2);  
      response.data.scholars.forEach(function(val, i){
        const result = ic.imported_scholars.findIndex(value => {
          if(trimAndLower(value.Firstname+value.Lastname+value.Middlename+value.Mother_firstname+value.Mother_maiden_name+value.Mother_middlename) === trimAndLower(val.firstname+val.lastname+val.middlename+val.mother_details.firstname+val.mother_details.maiden_name+val.mother_details.middlename)){
            return true;
          }
        });

        if (result > -1) {
          addError("Error: Scholar already exist", result);
        }
        
        scholar_count++;
        ic.progress_value = Math.ceil(scholar_count / response.data.count * 100) -1;
        
        if(i === response.data.scholars.length -1){
          if(page !== numberOfPages -1){
            page++;
            checkIfScholarExist()
          }
          else{
            ic.checking_in = 'Finished';
            ic.check_finished = true;
            ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            swalert.toastInfo('Check Finished', 'success', 'top-right');
            ic.progress_value = 100;
            page = 0;
            scholar_count = 0;
          }
        }
        console.log(i, numberOfPages, page, scholar_count);
      });
    }, err =>{
      swalert.dialogBox(err.data.message, 'error', 'Failed');
    });
  }

  function upperCase(value){
    if (typeof value === 'string'){
      return value.toUpperCase();
    } 
    return value;
  }

  function validateFather(scholarsObj, idx){

    if (!scholarsObj.Father_lastname && !scholarsObj.Father_firstname && !scholarsObj.Father_middlename ) return;

    // if (scholarsObj.Father_lastname || scholarsObj.Father_firstname || scholarsObj.Father_middlename) {
    validateLettersSpaces(scholarsObj.Father_lastname, "Father_lastname", idx);
    validateLettersSpaces(scholarsObj.Father_firstname, "Father_firstname", idx);
    validateLettersSpaces(scholarsObj.Father_middlename, "Father_middlename", idx);
    // }
    // else{
    //   ic.gridOptions.data[idx].error.push("Error: Incomplete Father details");
    //   ic.total_errors += 1;
    //   return;
    // }
  }

  function validateMother(scholarsObj, idx){
    // if (!scholarsObj.Mother_maiden_name || !scholarsObj.Mother_firstname) {
    //   ic.gridOptions.data[idx].error.push("Error: Mother details is required");
    //   ic.total_errors += 1;
    //   return;
    // }

    validateLettersSpaces(scholarsObj.Mother_maiden_name, "Mother_maiden_name", idx);
    validateLettersSpaces(scholarsObj.Mother_firstname, "Mother_firstname", idx);
    validateLettersSpaces(scholarsObj.Mother_middlename, "Mother_middlename", idx);

  }

  function validateLettersSpaces(value, value_name, idx){

    let midname = ['Mother_middlename', 'Middlename'];

    if (value_name === 'Father_middlename' && value === undefined) return;

    if (!value && midname.indexOf(value_name) > -1) return;

    if (!value) {
      addError("Error: Empty "+value_name, idx);
      return true;     
    }

    let str = value.toString().trim();

    if (!str || !/^[a-zA-Z\s]+$/.test(str) || str.toLowerCase() === "none" || str.toLowerCase() === "none" && midname.indexOf(value_name) > -1) {
      addError("Error: Invalid "+value_name+" "+value, idx);
      return true;
    }

    return;
  }

  function validate(referenceArray, fieldname, error, idx){
    if (referenceArray.indexOf(fieldname) === -1) {
        ic.gridOptions.data[idx].error.push(error);
        ic.total_errors += 1;
    }
    return;
  }

  function addError(error, idx){
    ic.gridOptions.data[idx].error.push(error);
    ic.total_errors += 1;
  }

  function concatAndLower(value){
    // if (!value.Firstname || !value.Lastname || !value.Middlename) return undefined;
    let mname = value.Middlename ? value.Middlename : "";
    return (value.Firstname+value.Lastname+mname).replace(/ |,/g,'').trim().toLowerCase();
  }

  function trimAndLower(value){
    return (value || "").replace('undefined', '').toString().trim().toLowerCase();
  }

  function importScholarsData(imported_data){
    importScholarApiService.importScholars(imported_data).then(response =>{
      ic.check_finished = false;
      swalert.dialogBox('Import successful!', 'success', 'Success');
      ic.show_spinner = false;
    }, err => {
      console.log(err);
      ic.check_finished = false;
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