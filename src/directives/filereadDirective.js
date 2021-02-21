var XLSX = require('xlsx/dist/xlsx.full.min.js');
angular.module('psmsApp').directive("fileread", [function () {
  return {
    scope: {
      opts: '='
    },
    link: function ($scope, $elm, $attrs) {
      $elm.on('change', function (changeEvent) {
        var reader = new FileReader();
        
        reader.onload = function (evt) {
          $scope.$apply(function () {

            var errors = [];
            var headers = [
                            'Lastname', 'Firstname', 'Middlename', 'Date of Birth', 'Age',
                            'Gender', 'Father_firstname', 'Father_lastname', 'Father_middlename',
                            'Mother_firstname', 'Mother_maiden_name', 'Mother_middlename', 'School',
                            'Student ID NO', 'Degree', 'Course', 'Section', 'Year level', 'Semester', 'Academic year',
                            'Status', 'IP'
                          ];

            var data = evt.target.result;
            
            var workbook = XLSX.read(data, {type: 'binary'});
            
            var sheet_name = workbook.SheetNames.indexOf('Scholars list');

            if (sheet_name === -1){
                alert('Can\'t find sheet name Scholars list. Note! dont include spaces before and after Scholars list sheet');
                $elm.val(null);
                return;
            }

            var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets['Scholars list'], { header: 1 })[0];
            
            $scope.json_data = XLSX.utils.sheet_to_json(workbook.Sheets['Scholars list']);
            
            headers.forEach(function(val, i){
      
                if (headerNames.indexOf(val) === -1) {
                    errors.push(' Can\'t find header name '+val);
                }
      
            })

            angular.forEach($scope.json_data, function( row, index){
                // row.error = [];
                row.number = index+1;
            });

            if (errors.length > 0) {
                console.log(errors);
                $elm.val(null);
                alert(errors);
                return;
            }
            
            $scope.opts.data = $scope.json_data;
            $elm.val(null);

          });
        };
        
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]);