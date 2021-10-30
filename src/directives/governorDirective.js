const governor_directive = require('../views/governor_directive.html');

angular
.module('psmsApp').directive('governorDirective',[ function(){
  return{
    restrict:'E',
    templateUrl: governor_directive,
    controller: 'governorCtrl',
    controllerAs: 'gov',
    scope:{}
  }
}]);