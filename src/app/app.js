angular
.module('psmsApp', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngMaterial',
  // 'md.data.table',
  'chart.js'
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
      controller: 'dashboardCtrl',
      controllerAs: 'dc',
      Authenticated: true,
    })
    .state('scholars_list', {
      url: '/scholars_list',
      templateUrl: 'src/views/scholars_list.html',
      controller: 'scholarsListCtrl',
      controllerAs: 'sc',
      Authenticated: true,
      Authorized: true,
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
          controller: 'contractCtrl',
          controllerAs: 'c',
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

  $transitions.onBefore({}, function(transition) {

      if (transition.to().Authenticated && !authApiService.AuthenticatedUser()) {
          return transition.router.stateService.target('base');
      }

      if (!transition.to().Authenticated && authApiService.AuthenticatedUser()) {
          return false;
      }
  })

  $transitions.onStart({}, function(transition) {

    if (transition.to().Authenticated) {
      $rootScope.route_loader = true;
      var adminCannotAccess = [];
      var usersCannotAccess = ['user_accounts', 'contract'];
      var $state = transition.router.stateService;
      var auth = $cookies.getObject('auth');

      // if (!authApiService.AuthenticatedUser()) {
      //     $state.target('base');
      // }
      // else{

        $rootScope.token = auth.success;

        console.log('Running...');

        return authApiService.getAuthenticatedUser().then(response=>{
          
          $rootScope.access_degree = JSON.parse(response.data.degree_access);
          $rootScope.username = response.data.name;
          let degree_access = JSON.parse(response.data.degree_access);

          if (response.data.user_type === 'User') {

            validateDegree(degree_access, usersCannotAccess);
            validateRoute(usersCannotAccess);

          }
          else{
            validateDegree(degree_access, adminCannotAccess);
            validateRoute(adminCannotAccess);
            $rootScope.isAdmin = true;
          }

          console.log(usersCannotAccess);
          $rootScope.authenticated = true;

        });

      // }

        function validateDegree(degree_access, protected_route) {
            if (degree_access.indexOf('Masters') == -1 || degree_access.indexOf('Doctorate') == -1) {

                protected_route.push('add_masteral_doctorate_scholars');
                return;
            }
            
            return $rootScope.master_doctorate_access = true;
        }

        function validateRoute(protected_route) {
          if (protected_route.indexOf(transition.to().name) > -1) {
              transition.abort();
              $rootScope.route_loader = false;
              $state.$current.name ? $state.go($state.$current.name) : $state.go('dashboard') ;
          }
        }
      
    }

    // if (!transition.to().Authenticated) {
    //    if (authApiService.AuthenticatedUser()) {
    //       transition.abort();
    //    }
    // }

  });

  $transitions.onStart({ to: 'base'}, function(transition) {
      $rootScope.authenticated = false;
      $rootScope.route_loader = false;
  });

  $transitions.onSuccess({}, function(transition) {
      $rootScope.route_loader = false;
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
require('../factories/exportScholars');

require('../services/municipalitiesApiService');
require('../services/alertDialog');
require('../services/authApiService');
require('../services/schoolApiService');
require('../services/addressApiService');
require('../services/scholarApiService');
require('../services/academicContractService');
require('../services/usersApiService');
require('../services/academicSemesterYearApiService');


require('../controllers/mainCtrl');
require('../controllers/dashboardCtrl');
require('../controllers/loginCtrl');
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
