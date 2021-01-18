'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addUndergraduateCtrl
 * @description
 * # addUndergraduateCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
app.controller('undergraduateCtrl',['$scope', '$rootScope', '$cookies', '$window', '$location', '$timeout', 'schoolApiService', 'addressApiService', 'scholarApiService', 'debounce', 'moment',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, schoolApiService, addressApiService, scholarApiService, debounce, moment) {

  var uc = this;
  uc.status = "Status";
  uc.contract_status = "Contract status";

  uc.selectedStatus = function(selected){
    uc.scholars_loaded = false;
    uc.selected_status = selected == 'Status'? undefined : selected;
    getScholars();
  }

  uc.selectedContractStatus = function(selected){
    uc.scholars_loaded = false;
    uc.selected_contract_status = selected == 'Contract status'? undefined : selected;
    getScholars();
  }

  function getScholars(){

     let searched = { 
        searched_name: uc.scholar_lastname,
        scholar_status: uc.selected_status,
        contract_status: uc.selected_contract_status,
        degree: 'Undergraduate'
    };

     scholarApiService.getScholars(searched).then(response => {
      // console.log(response.data);
      uc.scholars = response.data;
      uc.scholars_loaded = true;
      uc.hide_spinner = true;
    }, err => {
      console.log(err);
    });    
  }

  $scope.$watch('uc.scholar_lastname', debounce(function() {

    uc.scholars_loaded = false;
    getScholars();

  }, 500), true);


  uc.exportNormal = function(){

    var scholar = [];;

    angular.forEach(uc.scholars, function(val, i){

        let new_data  = {
          Lastname: val.lastname,
          Firstname: val.firstname,
          Middlename: val.middlename,
          'Date of Birth': val.date_of_birth,
          Age: val.age,
          Gender: val.gender,
          Address: val.address.barangay_name+" "+val.address.municipality+", ANTIQUE",
          Municipality: val.address.municipality,
          Father: val.father.f_firstname+" "+val.father.f_lastname+", "+val.father.f_middlename,
          Mother: val.mother.m_firstname+" "+val.mother.m_lastname+", "+val.mother.m_middlename,
          School: val.school.school_name,
          'Student ID NO.': val.student_id_number,
          Semester: val.academicyear_semester_contract.semester,
          'Academic year': val.academicyear_semester_contract.academic_year,
          Status: val.scholar_status,
          'Contract status': val.contract_status,
          IP: val.IP
        }
        scholar.push(new_data);
        console.log(scholar);
    });

    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(scholar);

    XLSX.utils.book_append_sheet(wb, ws, 'Scholars list');

    XLSX.writeFile(wb, "Scholars list.xlsx");

    console.log(wb);

  }

  uc.exportMasterlist = function(){

    let municipalities = {
      'ANINI-Y':[],
      'TOBIAS FORNIER':[],
      'HAMTIC':[],
      'SAN JOSE':[],
      'SIBALOM':[],
      'SAN REMEGIO':[],
      'BELISON':[],
      'PATNONGON':[],
      'BUGASONG':[],
      'VALDERRAMA':[],
      'LAUA-AN':[],
      'BARBAZA':[],
      'TIBIAO':[],
      'CULASI':[],
      'SEBASTE':[],
      'PANDAN':[],
      'LIBERTAD':[],
      'CALUYA':[],
    };

    angular.forEach(uc.scholars, function(val, i){

        let scholar = {
          Lastname: val.lastname,
          Firstname: val.firstname,
          Middlename: val.middlename,
          'Date of Birth': val.date_of_birth,
          Age: val.age,
          Gender: val.gender,
          Address: val.address.barangay_name+" "+val.address.municipality+", ANTIQUE",
          Municipality: val.address.municipality,
          Father: val.father.f_firstname+" "+val.father.f_lastname+", "+val.father.f_middlename,
          Mother: val.mother.m_firstname+" "+val.mother.m_lastname+", "+val.mother.m_middlename,
          School: val.school.school_name,
          'Student ID NO.': val.student_id_number,
          'Year level.': val.year_level,
          Semester: val.academicyear_semester_contract.semester,
          'Academic year': val.academicyear_semester_contract.academic_year,
          Status: val.scholar_status,
          'Contract status': val.contract_status,
          IP: val.IP
        }

        checkMunicipality(val.address.municipality, municipalities, scholar);

    });

    var wb = XLSX.utils.book_new();

    Object.keys(municipalities).forEach(function(key){

        var ws = XLSX.utils.json_to_sheet(municipalities[key]);

        XLSX.utils.book_append_sheet(wb, ws, key);

    });

    XLSX.writeFile(wb, "Masterlist.xlsx");

    console.log(wb);

    // var wb = {
    //   adddress: [
    //       {"name":"John", "city": "Seattle"},
    //       {"name":"Mike", "city": "Los Angeles"},
    //       {"name":"Zach", "city": "New York"}     
    //   ]
    // };


    // var data = [
    //     {"name":"John", "city": "Seattle"},
    //     {"name":"Mike", "city": "Los Angeles"},
    //     {"name":"Zach", "city": "New York"}
    // ];

    // /* this line is only needed if you are not adding a script tag reference */
    // if(typeof XLSX == 'undefined') XLSX = require('xlsx');

    // /* make the worksheet */
    // var ws = XLSX.utils.json_to_sheet(data);

    // /* add to workbook */
    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "People");

    /* generate an XLSX file */
    // XLSX.writeFile(wb, "sheetjs.xlsx");
    // /* bookType can be any supported output type */
    // var wopts = { bookType:'xlsx', bookSST:false, type:'array' };

    // var wbout = XLSX.write(ws, wopts);

    // /* the saveAs call downloads a file on the local machine */
    // saveAs(new Blob([wbout],{type:"application/octet-stream"}), "test.xlsx");


  }

  function checkMunicipality(municipality, municipalities, scholar){
      switch(municipality){
        case 'ANINI-Y':
                municipalities['ANINI-Y'].push(scholar);
                break;
        case 'TOBIAS FORNIER':
                municipalities['TOBIAS FORNIER'].push(scholar);
                break;
        case 'HAMTIC':
                municipalities['HAMTIC'].push(scholar);
                break;
        case 'SAN JOSE':
                municipalities['SAN JOSE'].push(scholar);
                break;
        case 'SIBALOM':
                municipalities['SIBALOM'].push(scholar);
                break;
        case 'SAN REMEGIO':
                municipalities['SAN REMEGIO'].push(scholar);
                break;
        case 'BELISON':
                municipalities['BELISON'].push(scholar);
                break;
        case 'PATNONGON':
                municipalities['PATNONGON'].push(scholar);
                break;
        case 'BUGASONG':
                municipalities['BUGASONG'].push(scholar);
                break;
        case 'VALDERRAMA':
                municipalities['VALDERRAMA'].push(scholar);
                break;
        case 'LAUA-AN':
                municipalities['LAUA-AN'].push(scholar);
                break;
        case 'BARBAZA':
                municipalities['BARBAZA'].push(scholar);
                break;
        case 'TIBIAO':
                municipalities['TIBIAO'].push(scholar);
                break;
        case 'CULASI':
                municipalities['CULASI'].push(scholar);
                break;
        case 'SEBASTE':
                municipalities['SEBASTE'].push(scholar);
                break;
        case 'PANDAN':
                municipalities['PANDAN'].push(scholar);
                break;
        case 'LIBERTAD':
                municipalities['LIBERTAD'].push(scholar);
                break;
        case 'CALUYA':
                municipalities['CALUYA'].push(scholar);
                break;
      }      
  }


}]);

app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});