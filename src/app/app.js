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

  $urlRouterProvider.otherwise('/');

})
.run(['$transitions', '$rootScope', '$cookies', 'loginApiService', function($transitions, $rootScope, $cookies, loginApiService){

  var auth = $cookies.getObject('auth');
  console.log(auth);

  $transitions.onStart({}, function(transition) {

    var $state = transition.router.stateService;
    var auth = $cookies.getObject('auth');
    

    if (transition.to().Authenticated) {
        if (!loginApiService.AuthenticatedUser()) {
            $rootScope.authenticated = false;
            $state.go('base');
        }
        else{
          $rootScope.authenticated = true;
          $rootScope.token = auth.success;
          $rootScope.logging_in = false;
        }
    }

    if (!transition.to().Authenticated) {
       if (loginApiService.AuthenticatedUser()) {
          transition.abort();
       }
    }    

  });

  // $transitions.onStart({ to: 'dashboard'}, function(transition) {

  //   const $state = transition.router.stateService;
    
  //   if (!auth) $state.go('base');

  // });

}]);

require('angular-material');
require('angular-animate');
require('angular-aria');

require('../directives/addSchoolDirective.js');
require('../directives/addDoubleSlashesDirective.js');

require('../filters/filters.js');

require('../factories/debounce.js');
require('../factories/momentFactory.js');


require('../services/municipalitiesApiService.js');
require('../services/alertDialog.js');
require('../services/loginApiService.js');
require('../services/schoolApiService.js');
require('../services/addressApiService.js');
require('../services/scholarApiService.js');
require('../services/academicContractService.js');
require('../services/usersApiService.js');


require('../controllers/mainCtrl.js');
require('../controllers/loginCtrl.js');
require('../controllers/addUndergraduateCtrl.js');
require('../controllers/scholarsListCtrl.js');
require('../controllers/schoolsCtrl.js');
require('../controllers/addSchoolCtrl.js');
require('../controllers/updateSchoolCtrl.js');
require('../controllers/userAccountsCtrl.js');

