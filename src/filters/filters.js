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
    return 'images/user.png';
  }

});

angular.module('psmsApp').filter('checkScholarPhoto', function(){

  return function(photo){
    if (photo) {
    	return 'http://localhost:8000/storage/'+photo;
    } 
    return 'images/user.png';
  }

});

angular.module('psmsApp').filter('fatherDetails', function(){

  return function(details){
    if (details) {
      
      let parent_details = typeof details === 'object'? details : JSON.parse(details);

      if (parent_details.firstname !== null && parent_details.lastname !== null && parent_details.middlename !== null) {
        return parent_details.firstname+" "+parent_details.lastname+", "+parent_details.middlename;
      }
      return 'NONE';
    }
  }

});


angular.module('psmsApp').filter('motherDetails', function(){

  return function(details){
    if (details) {
      let parent_details = typeof details === 'object'? details : JSON.parse(details);
      return parent_details.firstname+" "+parent_details.maiden_name+", "+parent_details.middlename;
    }
  }

});