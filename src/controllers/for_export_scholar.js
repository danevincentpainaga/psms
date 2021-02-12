'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:importScholarsCtrl
 * @description
 * # importScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('importScholarsCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', '$interval', '$q','schoolApiService', 'addressApiService', 'scholarApiService', 'municipalitiesApiService', 'debounce', 'moment', 'exportScholars',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $interval, $q, schoolApiService, addressApiService, scholarApiService, municipalitiesApiService, debounce, moment, exportScholars) {

  var ic = this;

  ic.myData = [
    // {
    //     firstName: "Cox",
    //     lastName: "Carney",
    //     company: "Enormo",
    //     employed: true
    // },
    // {
    //     firstName: "Lorraine",
    //     lastName: "Wise",
    //     company: "Comveyer",
    //     employed: false
    // },
    // {
    //     firstName: "Nancy",
    //     lastName: "Waters",
    //     company: "Fuelton",
    //     employed: false
    // }
  ];

  ic.gridOptions = {
    enableColumnResizing: true,
    enableGridMenu: true,
    data: 'data',
    importerDataAddCallback: function ( grid, newObjects ) {

      ic.myData = ic.myData.concat( newObjects );
      ic.gridOptions.data = ic.myData;
      console.log(newObjects);
    },
    // columnDefs: [
    //   { field: 'lastname', width: '15%'},
    //   { field: 'firstname', width: '15%' },
    //   { field: 'middlename', width: '15%' },
    //   { field: 'date_of_birth', width: '15%' },
    //   { field: 'gender', width: '15%' },
    //   { displayName:'address', field: 'address["address"]', width: '30%' },
    //   { displayName:'municipality', field: 'address["municipality"]', width: '30%' },
    //   { displayName:'Father', field: 'father_details["father"]', width: '30%' },
    //   { displayName:'Mother', field: 'mother_details["mother"]', width: '30%' },
    //   { displayName:'School', field: 'school["school_name"]', width: '30%' },
    //   { displayName:'Student ID NO.', field: 'student_id_number', width: '15%' },
    //   { displayName:'Yearl level', field: 'year_level', width: '15%' },
    //   { displayName:'Semester', field: 'academicyear_semester_contract["semester"]', width: '15%' },
    //   { displayName:'Academic year', field: 'academicyear_semester_contract["academic_year"]', width: '15%' },
    //   { displayName:'Status', field: 'scholar_status', width: '10%' },
    //   { displayName:'Contract Status', field: 'contract_status', width: '10%' },
    //   { displayName:'Amount', field: 'academicyear_semester_contract["amount"]', width: '10%' },
    // ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterCsvFilename: 'myFile.csv',
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

  function transformValue(){

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

  // function getScholars(){

  //    let searched = {
  //       municipality: 'BELISON',
  //   };

  //   scholarApiService.getScholars(searched).then(response => {
  //     ic.gridOptions.data = response.data.data.map(item => {
  //       Object.assign(item.father_details, {father: item.father_details.lastname+" "+item.father_details.firstname+", "+item.father_details.middlename});
  //       Object.assign(item.mother_details, {mother: item.mother_details.lastname+" "+item.mother_details.firstname+", "+item.mother_details.middlename});
  //       return item;
  //     })

  //     console.log(ic.gridOptions.data);

  //   }, err => {
  //     console.log(err);
  //   });    
  // }

  ic.checkIfScholarExist = function(){

  }
  ic.gridOptions.data = ic.myData;
  getMunicipalities();
  // getScholars();

}]);