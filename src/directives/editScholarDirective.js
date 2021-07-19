const edit_scholar_template = require('../views/edit_scholar.html');

angular
  .module('psmsApp').directive('editScholar', ['$mdSidenav', function($mdSidenav){
  
  return{
    restrict:'E',
    scope:{
      scholar:'=',
      updated:'='
    },
    controller:'editScholarCtrl',
    controllerAs: 'ec',
    templateUrl: edit_scholar_template
  }
}]);