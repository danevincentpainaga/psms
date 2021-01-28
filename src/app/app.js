angular
.module('psmsApp', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngTouch',
  'ngMaterial',
  'md.data.table'
])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('base', {
      url: '/',
      templateUrl: 'src/views/login.html',
      controller: 'loginCtrl',
      controllerAs: 'lg',
      Authenticated: false,
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'src/views/dashboard.html',
      Authenticated: true,
    })
    .state('scholars_list', {
      url: '/scholars_list',
      templateUrl: 'src/views/scholars_list.html',
      controller: 'scholarsListCtrl',
      controllerAs: 'sc',
      Authenticated: true,
    })
    .state('add_undergraduate_scholars', {
      url: '/add_undergraduate_scholars',
      templateUrl: 'src/views/add_undergraduate_scholars.html',
      controller: 'addUndergraduateCtrl',
      controllerAs: 'ac',
      resolve:{
        academicContractDetails: function(academicContractService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return response.data[0];
          }, err=> {
            return false;
          });
        }
      },
      Authenticated: true,
    })
    .state('add_masteral_doctorate_scholars', {
      url: '/add_masteral_doctorate_scholars',
      templateUrl: 'src/views/add_masteral_doctorate_scholars.html',
      controller: 'addMastersDoctorateCtrl',
      controllerAs: 'md',
      resolve:{
        academicContractDetails: function(academicContractService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return response.data[0];
          }, err=> {
            return false;
          });
        }
      },
      Authenticated: true,
    })
    .state('address', {
      url: '/address',
      views:{
        '':{
          templateUrl: 'src/views/address.html',
        },
        'address-view@address':{
          templateUrl: 'src/views/address_list.html',
        }
      },
      Authenticated: true,
    })
    .state('schools', {
      url: '/schools',
      templateUrl: 'src/views/schools.html',
      controller: 'schoolsCtrl',
      controllerAs: 's',
      Authenticated: true,
    })
    .state('user_accounts', {
      url: '/user_accounts',
      templateUrl: 'src/views/user_accounts.html',
      controller: 'userAccountsCtrl',
      controllerAs: 'u',
      Authenticated: true,
    })
    .state('contract', {
      url: '/contract',
      templateUrl: 'src/views/contract.html',
      controller: 'contractCtrl',
      controllerAs: 'c',
      Authenticated: true,
    })
    .state('export', {
      url: '/export',
      templateUrl: 'src/views/export.html',
      controller: 'exportScholarsCtrl',
      controllerAs: 'ex',
      Authenticated: true,
    })
  $urlRouterProvider.otherwise('/');

})
.run(['$transitions', '$rootScope', '$cookies', 'authApiService', function($transitions, $rootScope, $cookies, authApiService){

  $transitions.onStart({}, function(transition) {

    var $state = transition.router.stateService;
    
    if (transition.to().Authenticated) {

      var auth = $cookies.getObject('auth');

      if (!authApiService.AuthenticatedUser()) {
          $state.go('base');
      }
      else{
        $rootScope.authenticated = true;
        $rootScope.token = auth.success;
        $rootScope.logging_in = false;
      }
      
    }

    if (!transition.to().Authenticated) {
       if (authApiService.AuthenticatedUser()) {
          transition.abort();
       }
    }

  });

  $transitions.onStart({ to: 'base'}, function(transition) {
      $rootScope.authenticated = false;
      $rootScope.loggged_out = false;
  });

}]);

require('angular-material');
require('angular-animate');
require('angular-aria');

require('../directives/fixedColumnTableDirective');
require('../directives/addSchoolDirective');
require('../directives/addDoubleSlashesDirective');
require('../directives/colorDegreeDirective');
require('../directives/colorScholarStatusDirective');
require('../directives/colorContractStatusDirective');
require('../directives/colorContractDirective');

require('../filters/filters');


require('../factories/addScholarsService');
require('../factories/debounce');
require('../factories/momentFactory');

require('../services/municipalitiesApiService');
require('../services/alertDialog');
require('../services/authApiService');
require('../services/schoolApiService');
require('../services/addressApiService');
require('../services/scholarApiService');
require('../services/academicContractService');
require('../services/usersApiService');
require('../services/academicSemesterYearApiService');


require('../controllers/mainCtrl.js');
require('../controllers/loginCtrl.js');
require('../controllers/addUndergraduateCtrl');
require('../controllers/addMastersDoctorateCtrl');
require('../controllers/scholarsListCtrl');
require('../controllers/schoolsCtrl');
require('../controllers/addSchoolCtrl');
require('../controllers/updateSchoolCtrl');
require('../controllers/userAccountsCtrl');
require('../controllers/contractCtrl');
require('../controllers/exportScholarsCtrl');
require('../controllers/editScholarCtrl');
