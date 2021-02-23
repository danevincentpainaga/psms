var XLSX = require('xlsx/dist/xlsx.full.min.js');

angular.module('psmsApp').factory('exportService',['$timeout', '$filter', function($timeout, $filter) {

    	var self = this;

		self.exportForDatabase = function(scholars, ctrl){

		    var exportedData = [];

		    angular.forEach(scholars, function(val, i){

		    	let father = self.parseIfJson(val.father_details);
		    	let mother = self.parseIfJson(val.mother_details);

		        let scholar = {
		          Lastname: val.lastname,
		          Firstname: val.firstname,
		          Middlename: val.middlename,
		          'Date of Birth': val.date_of_birth,
		          Age: val.age,
		          Gender: val.gender,
		          Address: val.address,
		          Father_lastname: father.lastname,
		          Father_firstname: father.firstname,
		          Father_middlename: father.middlename,
		          Mother_maiden_name: mother.maiden_name,
		          Mother_firstname: mother.firstname,
		          Mother_middlename: mother.middlename,
		          School: val.school_name,
		          'Student ID NO': val.student_id_number,
		          Degree: val.degree,
		          Course: val.course,
		          Section: val.section,
		          'Year level': val.year_level,
		          Semester: val.semester,
		          'Academic year': val.academic_year,
		          Status: val.scholar_status,
		          IP: val.IP
		        }

		        exportedData.push(scholar);

		    });

		    var wb = XLSX.utils.book_new();

		    var ws = XLSX.utils.json_to_sheet(exportedData);

		    XLSX.utils.book_append_sheet(wb, ws, 'Scholars list');

		    XLSX.writeFile(wb, "Scholars list.xlsx");

		}

		self.exportNormal = function(scholars, ctrl){

		    var exportedData = [];

		    angular.forEach(scholars, function(val, i){

		        let scholar = {
		          Lastname: val.lastname,
		          Firstname: val.firstname,
		          Middlename: val.middlename,
		          'Date of Birth': val.date_of_birth,
		          Age: val.age,
		          Gender: val.gender,
		          Address: val.address,
		          Municipality: val.municipality,
		          Father: $filter('fatherDetails')(val.father_details),
		          Mother: $filter('motherDetails')(val.mother_details),
		          School: val.school_name,
		          'Student ID NO': val.student_id_number,
		          Degree: val.degree,
		          Course: val.course,
		          Section: val.section,
		          'Year level.': val.year_level,
		          Semester: val.semester,
		          'Academic year': val.academic_year,
		          Status: val.scholar_status,
		          'Contract status': val.contract_status,
		          'Amount': $filter('amount')(val),
		          IP: val.IP
		        }

		        exportedData.push(scholar);

		    });

		    var wb = XLSX.utils.book_new();

		    var ws = XLSX.utils.json_to_sheet(exportedData);

		    XLSX.utils.book_append_sheet(wb, ws, 'Scholars list report');

		    XLSX.writeFile(wb, "Scholars list report.xlsx");

		}

		self.exportMasterlist = function(scholars, ctrl){

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

		    angular.forEach(scholars, function(val, i){

		        let scholar = {
		          Lastname: val.lastname,
		          Firstname: val.firstname,
		          Middlename: val.middlename,
		          'Date of Birth': val.date_of_birth,
		          Age: val.age,
		          Gender: val.gender,
		          Address: val.address,
		          Municipality: val.municipality,
		          Father: $filter('fatherDetails')(val.father_details),
		          Mother: $filter('motherDetails')(val.mother_details),
		          School: val.school_name,
		          'Student ID NO': val.student_id_number,
		          Degree: val.degree,
		          Course: val.course,
		          Section: val.section,
		          'Year level.': val.year_level,
		          Semester: val.semester,
		          'Academic year': val.academic_year,
		          Status: val.scholar_status,
		          'Contract status': val.contract_status,
		          'Amount': $filter('amount')(val),
		          IP: val.IP
		        }

		        self.checkMunicipality(val.municipality, municipalities, scholar);

		    });

		    var wb = XLSX.utils.book_new();

		    Object.keys(municipalities).forEach(function(key){

		        var ws = XLSX.utils.json_to_sheet(municipalities[key]);

		        XLSX.utils.book_append_sheet(wb, ws, key);

		    });

		    XLSX.writeFile(wb, "Scholars Masterlist.xlsx");
		    
		}

		self.checkMunicipality = function(municipality, municipalities, scholar){
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
		
		self.parseIfJson = function(details){
			return typeof details === 'object'? details : JSON.parse(details);
		}
		
    return self;
}]);