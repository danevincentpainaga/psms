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
        if (isDelete) {
          return val;
        }

        if (val) {
          //first only allow digits and slashes
          val = val.replace(/[^0-9\/]/g, '');

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