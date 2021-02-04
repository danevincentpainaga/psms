var moment = require('moment');

angular.module('psmsApp').filter('formatDate', function(){

  return function(date){
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  }

});

angular.module('psmsApp').filter('checkPhoto', function(){

  return function(photo){
    if (photo) {
    	return photo
    } 
    return 'images/user.jpg';
  }

});
