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
            var data = evt.target.result;
            
            var workbook = XLSX.read(data, {type: 'binary'});
            
            var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
            
            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
            
            var errors = [];
            var headers = [
                            'Lastname', 'Firstname', 'Middlename', 'Date of Birth', 'Age',
                            'Gender', 'Father_firstname', 'Father_lastname', 'Father_middlename',
                            'Mother_firstname', 'Mother_maiden_name', 'Mother_middlename', 'School',
                            'Course', 'Section', 'Student ID NO', 'Year level', 'Semester', 'Academic year',
                            'Status', 'IP'
                          ]
            headers.forEach(function(val, i){
      
                if (headerNames.indexOf(val) === -1) {
                    console.log(val);
                    errors.push(val);
                }
      
            })

            console.log(errors);
            // headerNames.forEach(function (h) {
                // $scope.opts.columnDefs.push({ displayName: h, field: h, width: '15%' });
            // });
            
            $scope.opts.data = data;
            console.log($scope.opts.data);
            $elm.val(null);
          });
        };
        
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]);