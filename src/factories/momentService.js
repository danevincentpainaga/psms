var moment = require('moment');
var app = angular.module('psmsApp');
app.factory('moment', ['addScholarsService', function(addScholarsService){
  return {
    changeFormat: function(passedDate){
      return moment(passedDate).format("DD/MM/YYYY");
    },
    validateDate: function(date){
    	return addScholarsService.calcAge(date) < 100 && addScholarsService.calcAge(date) > 14 && moment(date, 'MM/DD/YYYY', true).isValid() ? true : false;
    }
  }
}]);