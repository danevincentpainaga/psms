angular
.module('psmsApp').directive('addSchoolDirective',[ function(){

  function link(scope, elem, attrs){

  }

  return{
    restrict:'E',
    templateUrl: 'src/views/update_school_directive.html',
    controller: 'updateSchoolCtrl',
    controllerAs: 'up',
    scope:{
      schooldetails: '=',
      editing: '=',
    },
    link: link
  }
}]);