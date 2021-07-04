var moment = require('moment');
var app = angular.module('psmsApp');

app.filter('formatDate', function(){

  return function(date){
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  }

});

app.filter('checkPhoto', function(){

  return function(photo){
    if (photo) {
    	return photo
    } 
    return '/images/user.png';
  }

});

app.filter('checkScholarPhoto', function(){

  return function(photo){
    if (photo) {
    	return 'http://localhost:8000/storage/'+photo;
    } 
    return '/images/user.png';
  }

});

app.filter('fatherDetails', function(){

  return function(details){

    if (details) {
      
      let parent_details = typeof details === 'object'? details : JSON.parse(details);

      if (parent_details.firstname && parent_details.lastname && !parent_details.middlename) {
        return parent_details.firstname+" "+parent_details.lastname;
      }

      if (parent_details.firstname && parent_details.lastname && parent_details.middlename) {
        return parent_details.firstname+" "+parent_details.lastname+", "+parent_details.middlename;
      }

      return 'NONE';
    }
  }

});


app.filter('motherDetails', function(){

  return function(details){
    if (details) {
      let parent_details = typeof details === 'object'? details : JSON.parse(details);
      if (!parent_details.middlename) {
        return parent_details.firstname+" "+parent_details.maiden_name;
      }
      return parent_details.firstname+" "+parent_details.maiden_name+", "+parent_details.middlename;
    }
  }

});

app.filter('amount', function(){

  return function(scholar, bool){

    let masteral_doctorate_amount, undergraduate_amount;

    bool ? (masteral_doctorate_amount = scholar.academicyear_semester_contract.masteral_doctorate_amount, undergraduate_amount = scholar.academicyear_semester_contract.undergraduate_amount) : (masteral_doctorate_amount = scholar.masteral_doctorate_amount, undergraduate_amount = scholar.undergraduate_amount);
    
    return scholar.degree.toLowerCase() !== 'undergraduate'? masteral_doctorate_amount : undergraduate_amount;

  }

});

app.filter('formatYear', function(){

  return function(roman){

    switch(roman){
      case 'I':
            return '1st year';
      case 'II':
            return '2nd year';
      case 'III':
            return '3rd year';
      case 'IV':
            return '4th year';
      case 'V':
            return '5th year';
      case 'Vi':
            return '6th year';
    }

  }

});

app.filter('trim', function(){
  return function(value){
    let scholar = value.lastname+value.firstname+value.middlename;
    let newVal = value.lastname+', '+value.firstname+' '+value.middlename;
    if (scholar.length > 33) {
      return newVal.slice(0, 33)+'...';
    }
    return newVal;
  }
});

