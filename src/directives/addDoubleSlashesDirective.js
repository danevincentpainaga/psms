angular.module('psmsApp').directive('addDoubleSlashesDirective', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, element, attr, ctrl) {
      var isDelete = false;
      element.on('keydown', function(e){
        isDelete = e.keyCode === 8; // if we hit delete
      });
      // store regex patterns
      var mmRegEx = /^(0?[23456789]|01|10|12|11)$/;
      var mmDDRegEx = /^(0?[23456789]|01|10|12|1|11)[\/.](0[1-9]|[12][0-9]|3[01])$/;

      function inputValue(val) {

        var date = new Date().getFullYear().toString();
        var value = Array.from(val);

        if (isDelete) {
          return val;
        }

        if (val) {

          var len = val.length;

          val = val.replace(/[^0-9\/]/g, '');

          if (val.substring(0, 2) === '02' && value[3] > 2) {
             val = val.slice(0, -1);
          }

          if (value[0] === '/') {
            val = val.slice(0, -1);
          }

          if (val.length > 10) {
            val = val.substring(0, 10);
          }   

          if (value[0] < 1 && value[1] < 1 || value[3] < 1 && value[4] < 1) {
             val = val.slice(0, -1);
          }

          if (value[0] > 0 && value[1] > 2) {
             val = val.slice(0, -1);
          }

          if (value[0] > 1 || value[3] > 3 || value[6] < 1 || value[6] > date.substring(0, 1)) {
            val = val.slice(0, -1);
          }

          if (value[3] >= 3 && value[4] > 1) {
            val = val.slice(0, -1);
          }

          if (value[6] < 2 && value[7] < 9) {
            val = val.slice(0, -1);
          }

          if (value[6] < 2 && value[8] < 2) {
            val = val.slice(0, -1);
          }

          // prevent duplicate
          if (val[val.length - 1] === '/' && val.length - 2 >= 0 && val[val.length - 2] === '/') {
            val = val.slice(0, -1);
          }
          // test against or mm or mm/dd regex patterns
          // automatically add slashes
          if (mmRegEx.test(val)) {
            val += '/';
          } else if (mmDDRegEx.test(val)) {
            val += '/';
          }

          if (len === 3 && value[2] !== '/') {
            val =  val.substring(2, -1) + '/'+value[len-1];
          }

          if (len === 6 && value[5] !== '/') {
            val =  val.substring(5, -1) + '/'+value[len-1];
          }

          ctrl.$setViewValue(val);
          ctrl.$render();
          return val;

        } else {
          return undefined;
        }
      }
      ctrl.$parsers.push(inputValue);
    }
  };
});