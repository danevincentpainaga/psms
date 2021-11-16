var moment = require('moment');
var app = angular.module('psmsApp');
import { baseUrl } from '../apiServices/baseUrl';

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
    	return baseUrl+'storage/'+photo;
    } 
    return '/images/user.png';
  }
});

app.filter('fatherDetails', function(){

  return function(details){

    if (details) {
      
      let parent_details = typeof details === 'object'? details : JSON.parse(details);
      let suffix = parent_details.suffix? ", "+parent_details.suffix : "";
      let middlename = parent_details.middlename? " "+parent_details.middlename : "";

      if(!parent_details.firstname && !parent_details.lastname && !parent_details.middlename){
        return 'NONE';
      }

      return parent_details.firstname+middlename+" "+parent_details.lastname+suffix;
      // if (parent_details.firstname && parent_details.lastname && !parent_details.middlename) {
      //   return parent_details.firstname+" "+parent_details.lastname+suffix;
      // }

      // if (parent_details.firstname && parent_details.lastname && parent_details.middlename) {
      //   return parent_details.firstname+middlename+" "+parent_details.lastname+suffix;
      // }

      // return 'NONE';
    }
  }

});


app.filter('motherDetails', function(){

  return function(details){
    if (details) {
      let parent_details = typeof details === 'object'? details : JSON.parse(details);
      let middlename = parent_details.middlename ? parent_details.middlename : "";
      return parent_details.firstname+" "+ middlename +" "+parent_details.maiden_name;
      // if (!parent_details.middlename) {
      //   return parent_details.firstname+" "+parent_details.maiden_name;
      // }
      // return parent_details.firstname+" "+parent_details.middlename+" "+parent_details.maiden_name;
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
      case 'VI':
            return '6th year';
    }

  }

});

app.filter('formatAddress', function(){
  return function(addressObj){
    return addressObj.address+' '+addressObj.municipality+', ANTIQUE';
  }
});

app.filter('formatName', function(){
  return function(value){
    let suffix = value.suffix? ", "+value.suffix : "";
    let middlename = value.middlename? " "+value.middlename : "";
    let newVal = value.lastname+', '+value.firstname+middlename+suffix;
    return newVal;
  }
});

app.filter('trim', function(){
  return function(value){
    let suffix = value.suffix? ", "+value.suffix : "";
    let middlename = value.middlename? " "+value.middlename : "";
    let scholar = value.lastname+value.firstname+middlename+suffix;
    let newVal = value.lastname+', '+value.firstname+middlename+suffix;
    if (scholar.length > 33) {
      return newVal.slice(0, 33)+'...';
    }
    return newVal;
  }
});

app.filter('concatName', function(){
  return function(value){
    let suffix = value.suffix? ", "+value.suffix : "";
    let middlename = value.middlename? " "+value.middlename : "";
    return value.firstname+middlename+' '+value.lastname+suffix;
  }
});

app.filter('displayAmount', function(){
  return function(degree, contract){
    if(degree === 'Undergraduate') {
      return contract.undergraduate_amount;
    }
    return contract.masteral_doctorate_amount;
  }
});

app.filter('formatGovernor', function(){
  return function(gov){
    let suffix = gov.suffix? (", "+gov.suffix) : "";
    return gov.firstname +" "+ gov.initial +". "+ gov.lastname + suffix;
  }
});

