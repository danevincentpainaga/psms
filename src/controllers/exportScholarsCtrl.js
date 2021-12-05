'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:exportScholarsCtrl
 * @description
 * # exportScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('exportScholarsCtrl',['$scope', '$filter', '$timeout', 'schoolApiService', 'addressApiService', 'exportScholarsApiService', 'exportService', 'uiGridConstants',
  function ($scope, $filter, $timeout, schoolApiService, addressApiService, exportScholarsApiService, exportService, uiGridConstants) {

  var ex = this;

  ex.number = 1;
  ex.mergedChunks = [];
  ex.municipalities = [];
  ex.schools = [];

  ex.gridOptions = {
    enableFiltering: false,
    enableColumnResizing: true,
    enableGridMenu: true,
    data: ex.mergedChunks,
    // importerDataAddCallback: function ( grid, newObjects ) {

    // },
    columnDefs: [
      { field: 'index', displayName: 'NO.', width: '50',  enableFiltering: false, pinnedLeft:true, enableSorting: false, cellClass: 'row-no', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
      { field: 'lastname', width: '25%', enablePinning:true,
        filter: {
          condition: uiGridConstants.filter.EXACT,
        } 
      },
      { field: 'firstname', width: '25%', enablePinning:true },
      { field: 'middlename', width: '25%', enablePinning:true },
      { field: 'date_of_birth', width: '18%' },
      { field: 'gender', width: '11%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' } ]
        }
      },
      { displayName:'Status', field: 'scholar_status', width: '10%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ { value: 'NEW', label: 'NEW' }, { value: 'OLD', label: 'OLD' } ]
        }
      },
      { displayName:'Contract Status', field: 'contract_status', width: '14%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ { value: 'Pre-Approved', label: 'Pre-Approved' }, { value: 'Approved', label: 'Approved' }, { value: 'Pending', label: 'Pending' }, { value: 'In-Active', label: 'In-Active' } ]
        }
      },
      { displayName:'Address', field: 'address', width: '30%' },
      { displayName:'Municipality', field: 'municipality', width: '15%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: ex.municipalities
        }
      },
      { displayName:'Father', field: 'father', width: '30%' },
      { displayName:'Mother', field: 'mother', width: '30%' },
      { displayName:'School', field: 'school_name', width: '20%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: ex.schools
        }
      },
      { displayName:'Degree', field: 'degree', width: '15%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ 
            { value: 'Undergraduate', label: 'Undergraduate' }, 
            { value: 'Masters', label: 'Masters' },
            { value: 'Doctorate', label: 'Doctorate' }
          ]
        }
      },
      { displayName:'Student ID NO.', field: 'student_id_number', width: '15%' },
      { displayName:'Course', field: 'course', width: '30%' },
      { displayName:'Section', field: 'section', width: '6%' },
      { displayName:'Yearl level', field: 'year_level', width: '7%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ 
            { value: 'I', label: '1st year' }, 
            { value: 'II', label: '2nd year' },
            { value: 'III', label: '3rd year' },
            { value: 'IV', label: '4th year' },
            { value: 'V', label: '5th year' },
            { value: 'VI', label: '6th year' }
          ]
        },
        cellFilter: 'formatYear'
      },
      { displayName:'Semester', field: 'semester', width: '10%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ 
            { value: '1st Semester', label: '1st Semester' }, 
            { value: '2nd Semester', label: '2nd Semester' },
            { value: '3rd Semester', label: '3rd Semester' }
          ]
        }
      },
      { displayName:'Academic year', field: 'academic_year', width: '10%' },
      { displayName:'Amount', field: 'amount', width: '10%' },
      { displayName:'IP', field: 'IP', width: '6%',
        filter: {
          type: uiGridConstants.filter.SELECT,
          condition: uiGridConstants.filter.EXACT,
          selectOptions: [ { value: 'YES', label: 'YES' }, { value: 'NO', label: 'NO' } ]
        }
      }
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LEGAL',
    exporterPdfDefaultStyle: {fontSize: 7},
    exporterPdfTableStyle: {margin: [-30, -30, 0, 0], fontSize: 7 },
    exporterPdfMaxGridWidth: 790,
    exporterPdfTableHeaderStyle: {fontSize: 7, bold: true, italics: true, color: 'red'},
    exporterCsvFilename: 'Exported_scholars.csv',
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    exporterExcelFilename: 'Exported_scholars.xlsx',
    exporterExcelSheetName: 'Scholars',
    onRegisterApi: function(gridApi){
      
      ex.gridApi = gridApi;

      ex.gridApi.core.on.rowsRendered($scope, function() {
        ex.filteredGrid = ex.gridApi.core.getVisibleRows().map((row)=>{
          return row.entity;
        });
      });

      ex.gridApi.pinning.on.columnPinned($scope, function (colDef, container) {
        if (!container) {
          colDef.visible = false;
          ex.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          $timeout(function () {
            colDef.visible = true;
            ex.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          });
        }
      });

    }
  };

  ex.toggleFiltering = function(){
    ex.gridOptions.enableFiltering = !ex.gridOptions.enableFiltering;
    ex.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };

  ex.exportForDatabase = function(){
    exportService.exportForDatabase(ex.filteredGrid, ex);
  }

  ex.exportMasterlist = function(){
    exportService.exportMasterlist(ex.filteredGrid, ex);
  }

  ex.exportNormal = function(){
    exportService.exportNormal(ex.filteredGrid, ex);
  }


  const s2ab = (s) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  function getScholarsToExport(){

    //  let searched = { 
    //     searched_name: ex.scholar_lastname,
    //     age: ex.age,
    //     gender: ex.gender,
    //     scholar_status: ex.scholar_status,
    //     contract_status: ex.contract_status,
    //     address: ex.address,
    //     municipality: ex.municipality,
    //     degree: ex.degree,
    //     course: ex.course,
    //     section: ex.section,
    //     schoolId: ex.school,
    //     student_id_number: ex.student_id_number,
    //     year_level: ex.year_level,
    //     semester: ex.semester,
    //     academic_year: ex.academic_year,
    //     IP: ex.IP,
    // };
    var FileSaver = require('file-saver');

    exportScholarsApiService.getScholarsToExport().then(response => {
      console.log(response.data);
      // var link = document.createElement('a');
      // link.href = 'http://127.0.0.1:8000/storage/'+response.data;
      // link.download = response.data;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // splitArrayOfChunks(response.data);
      // var a = document.createElement("a");
      // var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      // FileSaver.saveAs(blob, "invoices.xlsx");
      // a.href = fileURL;
      // a.download = 'scholars.xlsx';
      // a.click();
      ex.scholars_loaded = true;
      ex.hide_spinner = true;
      // var contentDisposition = response.headers('Content-Disposition');
      // const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      // const matches = fileNameRegex.exec(contentDisposition);
      // console.log(contentDisposition);
      // var filename = (matches != null && matches[1] ? matches[1] : 'salary.xlsx');

      // // The actual download
      var blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'invoices.xlsx';

      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
    }, err => {
      console.log(err);
    });    
  }

  function splitArrayOfChunks(array_of_chunks){
    for (var i = 0; i < array_of_chunks.length; i++) {
      mergeChunks(array_of_chunks[i]);
    }
  }

  function mergeChunks(chunk){
    for (var i = 0; i < chunk.length; i++) {

      includeMunicipalityForFilter(chunk[i].municipality);
      includeSchoolForFilter(chunk[i].school_name);

      Object.assign(chunk[i], { 
        row_no: ex.number++,
        amount: $filter('currency')($filter('amount')(chunk[i]), '', 0),
        father: $filter('fatherDetails')(chunk[i].father_details),
        mother: $filter('motherDetails')(chunk[i].mother_details),
        address: chunk[i].address+' '+chunk[i].municipality+', ANTIQUE',
      });

      ex.mergedChunks.push(chunk[i]);
   
    }
  }

  function includeMunicipalityForFilter(municipality){
    if (!ex.municipalities.some(item => item.value === municipality)) {
      ex.municipalities.push({ value: municipality, label: municipality });
    }
  }

  function includeSchoolForFilter(school_name){
    if (!ex.schools.some(item => item.value === school_name)) {
      ex.schools.push({ value: school_name, label: school_name });
    }
  }

  getScholarsToExport();
  
}]);

