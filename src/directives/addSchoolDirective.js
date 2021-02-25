const update_school_directive = require('../views/update_school_directive.html');

angular
.module('psmsApp').directive('addSchoolDirective',[ function(){

  function link(scope, elem, attrs){

  }

  return{
    restrict:'E',
    templateUrl: update_school_directive,
    controller: 'updateSchoolCtrl',
    controllerAs: 'up',
    scope:{
      schooldetails: '=',
      editing: '=',
    },
    link: link
  }
}]);