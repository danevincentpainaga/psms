var XLSX = require('xlsx/dist/xlsx.full.min.js');

angular.module('psmsApp').factory('exportScholars', function($timeout) {

    	var self = this;

		self.exportNormal = function(scholars, ctrl){

		    var scholar = [];

		    angular.forEach(scholars, function(val, i){

		        let exportedData = {
		          Lastname: val.lastname,
		          Firstname: val.firstname,
		          Middlename: val.middlename,
		          'Date of Birth': val.date_of_birth,
		          Age: val.age,
		          Gender: val.gender,
		          Address: val.address.address,
		          Municipality: val.address.municipality,
		          Father: self.excludeNull(val.father_details.firstname)+" "+self.excludeNull(val.father_details.lastname) + self.excludeNull(val.father_details.middlename, true),
		          Mother: self.excludeNull(val.mother_details.firstname)+" "+self.excludeNull(val.mother_details.lastname) + self.excludeNull(val.mother_details.middlename, true),
		          School: val.school.school_name,
		          'Student ID NO.': val.student_id_number,
		          'Year level.': val.year_level,
		          Semester: val.academicyear_semester_contract.semester,
		          'Academic year': val.academicyear_semester_contract.academic_year,
		          Status: val.scholar_status,
		          'Contract status': val.contract_status,
		          'Amount': val.academicyear_semester_contract.amount,
		          IP: val.IP
		        }

		        scholar.push(exportedData);

		    });

		    var wb = XLSX.utils.book_new();

		    var ws = XLSX.utils.json_to_sheet(scholar);

		    XLSX.utils.book_append_sheet(wb, ws, 'Scholars list');

		    XLSX.writeFile(wb, "Scholars list.xlsx");

		    ctrl.show_spinner = false;

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
		          Address: val.address.address,
		          Municipality: val.address.municipality,
		          Father: self.excludeNull(val.father_details.firstname)+" "+self.excludeNull(val.father_details.lastname) + self.excludeNull(val.father_details.middlename, true),
		          Mother: self.excludeNull(val.mother_details.firstname)+" "+self.excludeNull(val.mother_details.lastname) + self.excludeNull(val.mother_details.middlename, true),
		          School: val.school.school_name,
		          'Student ID NO.': val.student_id_number,
		          'Year level.': val.year_level,
		          Semester: val.academicyear_semester_contract.semester,
		          'Academic year': val.academicyear_semester_contract.academic_year,
		          Status: val.scholar_status,
		          'Contract status': val.contract_status,
		          'Amount': val.academicyear_semester_contract.amount,
		          IP: val.IP
		        }

		        self.checkMunicipality(val.address.municipality, municipalities, scholar);

		    });

		    var wb = XLSX.utils.book_new();

		    Object.keys(municipalities).forEach(function(key){

		        var ws = XLSX.utils.json_to_sheet(municipalities[key]);

		        XLSX.utils.book_append_sheet(wb, ws, key);

		    });

		    XLSX.writeFile(wb, "Scholars Masterlist.xlsx");

		    ctrl.show_spinner = false;
		    
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

		self.excludeNull = function(value, isMiddlename){
			if (value) {
				return value = isMiddlename ? ", " + value : value;
			}
			return "";
		}
		
    return self;
});