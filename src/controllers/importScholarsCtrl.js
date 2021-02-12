'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:importScholarsCtrl
 * @description
 * # importScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('importScholarsCtrl',['$scope', '$q', 'municipalitiesApiService', 'schoolApiService', 'addressApiService', 'scholarApiService', 'courseApiService', 'academicContractService', 'moment', '$timeout',
  function ($scope, $q, municipalitiesApiService, schoolApiService, addressApiService, scholarApiService, courseApiService, academicContractService, moment, $timeout) {

  var ic = this;
  var year_level = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  var scholar_status = ['NEW', 'OLD'];
  var ip = ['YES', 'NO'];
  var gender = ['Male', 'Female'];

  ic.myData = [];

  ic.gridOptions = {
    enableColumnResizing: true,
    enableGridMenu: true,
    // data: 'data',
    importerDataAddCallback: function ( grid, newObjects ) {

      ic.myData = ic.myData.concat( newObjects );
      ic.gridOptions.data = ic.myData;
      console.log(newObjects);
    },
    columnDefs: [
      { displayName: 'Error', field: 'error', width: '15%'},
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
      { field:'Course',  width: '30%' },
      { field:'Section',  width: '30%' },
      { field:'Student ID NO',  width: '15%' },
      { field:'Year level', width: '15%' },
      { field:'Semester',width: '15%' },
      { field:'Academic year', width: '15%' },
      { field:'Status',  width: '10%' },
      { field:'IP', width: '10%' },
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterCsvFilename: 'Imported_scholars.csv',
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    exporterExcelFilename: 'myFile.xlsx',
    exporterExcelSheetName: 'Sheet1',
    onRegisterApi: function(gridApi){
      ic.gridApi = gridApi;
    }
  };

  ic.selectMunicipalities = function(){
    ic.hasImported = true;
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

      ic.scholars_to_import = angular.copy(ic.gridOptions.data);
      console.log("checking... ");
      validateImportedScholars();

  }

  ic.importToDatabase = function(){
    console.log(ic.scholars_to_import);
  }

  function validateImportedScholars(){
      $q.all([scholarApiService.getAllScholars(), addressApiService.getAddresses(), schoolApiService.getListOfSchool(), courseApiService.getCourses(), academicContractService.getAcademicContractDetails()]).then(response=>{

        ic.scholars_to_import.forEach(function(val, i){

          $timeout(()=>{
            validateScholarsName(response, val, i);
            if (i === ic.scholars_to_import.length -1) {
              ic.checking_in = 'Finished';
            }
          });

        });

      }, err=> {
        console.log(err);
      });
  }

  function validateAddress(addressesArray, scholarsObj, idx){

      console.log("Address checking... ");

      const address = addressesArray.find(item => {
        if (item.address.replace(/ |,/g,'') === scholarsObj.Address.replace(/ |,/g,'')) {
            scholarsObj.Address = item.address_id;
            return item;
        }
      });

      if (!address) {
        ic.gridOptions.data[idx].error.push("Error: Address "+scholarsObj.Address+" does not exist in database ");
      }

  }

  function validateSchool(schoolsArray, scholarsObj, idx){

      console.log("School checking...");

      const school = schoolsArray.find(item => {
        if (item.school_name.replace(/ |,/g,'') === scholarsObj.School.replace(/ |,/g,'')) {
            scholarsObj.School = item.school_id;
            return item;
        }
      });

      if (!school) {
          ic.gridOptions.data[idx].error.push("Error: School "+scholarsObj.School+" does not exist in database ");
      }

  }

  function validateCourse(coursesArray, scholarsObj, idx){

      console.log("Course checking...");

      const course = coursesArray.find(item => {
        if (item.course.replace(/ |,/g,'') === scholarsObj.Course.replace(/ |,/g,'')) {
            scholarsObj.Course = item.course_id;
            return item;
        }
      });

      if (!course) {
        ic.gridOptions.data[idx].error.push("Error: Course "+scholarsObj.Course+" does not exist in database ");
      }

  }

  function validateContractDetails(contractDetailsArray, scholarsObj, idx){

      console.log("Contract checking...");

      const contract = contractDetailsArray.find(item => {
        if (item.academic_year_semester.semester.trim() === scholarsObj.Semester.trim() && item.academic_year_semester.academic_year.trim() === scholarsObj['Academic year'].trim()) {
            scholarsObj.Contract_id = item.ascId;
            return item;
        }
      });

      if (!contract) {
        ic.gridOptions.data[idx].error.push("Error: Academic year semester Invalid");
      }

  }

  function validateScholarsName(response, scholarsObj, idx){

      var total = ic.scholars_to_import.length - 1;

      ic.gridOptions.data[idx].error = [];

      ic.checking_in = "Checking... "+scholarsObj.Lastname;

      const result = response[0].data.find(item => {

        if (item.lastname.trim() === scholarsObj.Lastname.trim() && item.firstname.trim() === scholarsObj.Firstname.trim() && item.middlename.trim() === scholarsObj.Middlename.trim()) {
            ic.gridOptions.data[idx].error.push("Error: Scholar already exist");
            return item;
        }

      });


      if (result) {

        ic.progress_value = Math.round(idx / total * 100);

      }
      else{

          validate(scholar_status, scholarsObj.Status, "Error: Invalid status", idx);
          validate(ip, scholarsObj.IP, "Error: Invalid IP", idx);
          validate(year_level, scholarsObj['Year level'], "Error: Invalid Year level", idx);
          validate(gender, scholarsObj.Gender, "Error: Invalid Gender", idx);

          if (!scholarsObj.Section) {
              ic.gridOptions.data[idx].error.push("Error: Section is required");
          }

          if (!moment.validateDate(scholarsObj['Date of Birth'])) {
              ic.gridOptions.data[idx].error.push("Error: Invalid Date of Birth");
          }

          if (!scholarsObj.Mother_maiden_name && !scholarsObj.Mother_firstname && !scholarsObj.Mother_middlename ) {
              ic.gridOptions.data[idx].error.push("Error: Mother's details is required");
          }

          validateAddress(response[1].data, scholarsObj, idx);
          validateSchool(response[2].data, scholarsObj, idx);
          validateCourse(response[3].data, scholarsObj, idx);
          validateContractDetails(response[4].data, scholarsObj, idx);

          ic.progress_value = Math.round(idx / total * 100);

      }

  }

  function validate(referenceArray, fieldname, error, idx){
    if (referenceArray.indexOf(fieldname) === -1) {
        ic.gridOptions.data[idx].error.push(error);
    }   
  }

  ic.gridOptions.data = ic.myData;

  getMunicipalities();

}]);