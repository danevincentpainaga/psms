require('../views/header.html');
require('../views/side_nav.html');
require('../views/add_user_accounts.html');
require('../views/add_update_address.html');
require('../views/add_update_contract.html');
require('../views/add_update_course.html');
require('../views/import_scholars.tmpl.html');

const login_view = require('../views/login.html');
const dashboard_view = require('../views/dashboard.html');
const scholars_list_view = require('../views/scholars_list.html');
const undergraduate_view = require('../views/add_undergraduate_scholars.html');
const mastera_doctorate_view = require('../views/add_masteral_doctorate_scholars.html');
const address_view = require('../views/address.html');
const schools_view = require('../views/schools.html');
const course_view = require('../views/course.html');
const user_accounts_view = require('../views/user_accounts.html');
const contract_view = require('../views/contract.html');
const export_view = require('../views/export.html');
const import_view = require('../views/import.html');
const renew_scholars_view = require('../views/renew_scholars.html');

angular
.module('psmsApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngMaterial',
  'ngAria',
  'chart.js',
  'ui.grid',
  'ui.grid.exporter',
  'ui.grid.importer',
  'ui.grid.resizeColumns',
  'ui.grid.moveColumns',
  'ui.grid.autoResize',
  'ui.grid.pinning',
])
.config(['$stateProvider', '$urlRouterProvider', '$mdAriaProvider', function ($stateProvider, $urlRouterProvider, $mdAriaProvider) {
  $stateProvider
    .state('base', {
      url: '/',
      templateUrl: login_view,
      controller: 'loginCtrl',
      controllerAs: 'lg',
      Authenticated: false,
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: dashboard_view,
      controller: 'dashboardCtrl',
      controllerAs: 'dc',
      Authenticated: true,
    })
    .state('scholars_list', {
      url: '/scholars_list',
      templateUrl: scholars_list_view,
      controller: 'scholarsListCtrl',
      controllerAs: 'sc',
      Authenticated: true,
    })
    .state('add_undergraduate_scholars', {
      url: '/add_undergraduate_scholars',
      templateUrl: undergraduate_view,
      controller: 'addUndergraduateCtrl',
      controllerAs: 'ac',
      resolve:{
        academicContractDetails: ['academicContractService', 'validateContractStatusService', function(academicContractService, validateContractStatusService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return validateContractStatusService.checkStatus(response);
          }, err=> {
            return validateContractStatusService.checkStatus(err);
          });
        }]
      },
      Authenticated: true,
    })
    .state('add_masteral_doctorate_scholars', {
      url: '/add_masteral_doctorate_scholars',
      templateUrl: mastera_doctorate_view,
      controller: 'addMastersDoctorateCtrl',
      controllerAs: 'md',
      resolve:{
        academicContractDetails: ['academicContractService', 'validateContractStatusService', function(academicContractService, validateContractStatusService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return validateContractStatusService.checkStatus(response);
          }, err=> {
            return validateContractStatusService.checkStatus(err);
          });
        }]
      },
      Authenticated: true,
    })
    .state('address', {
      url: '/address',
      templateUrl: address_view,
      controller: 'addressCtrl',
      controllerAs: 'ad',
      Authenticated: true,
    })
    .state('schools', {
      url: '/schools',
      templateUrl: schools_view,
      controller: 'schoolsCtrl',
      controllerAs: 's',
      Authenticated: true,
    })
    .state('course', {
      url: '/course',
      templateUrl: course_view,
      controller: 'courseCtrl',
      controllerAs: 'cc',
      Authenticated: true,
    })
    .state('user_accounts', {
      url: '/user_accounts',
      templateUrl: user_accounts_view,
      controller: 'userAccountsCtrl',
      controllerAs: 'u',
      Authenticated: true,
    })
    .state('contract', {
      url: '/contract',
      templateUrl: contract_view,
      controller: 'contractCtrl',
      controllerAs: 'c',
      Authenticated: true,
    })
    .state('export', {
      url: '/export',
      templateUrl: export_view,
      controller: 'exportScholarsCtrl',
      controllerAs: 'ex',
      Authenticated: true,
    })
    .state('import', {
      url: '/import',
      templateUrl: import_view,
      controller: 'importScholarsCtrl',
      controllerAs: 'ic',
      resolve:{
        academicContractDetails: ['academicContractService', 'validateContractStatusService', function(academicContractService, validateContractStatusService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return validateContractStatusService.checkStatus(response);
          }, err=> {
            return validateContractStatusService.checkStatus(err);
          });
        }]
      },
      Authenticated: true,
    })
    .state('renew_scholars', {
      url: '/renew_scholars',
      templateUrl: renew_scholars_view,
      controller: 'addUndergraduateCtrl',
      controllerAs: 'ac',
      resolve:{
        academicContractDetails: ['academicContractService', 'validateContractStatusService', function(academicContractService, validateContractStatusService){
          return academicContractService.getAcademicContractDetails().then(response => {
            return validateContractStatusService.checkStatus(response);
          }, err=> {
            return validateContractStatusService.checkStatus(err);
          });
        }]
      },
      Authenticated: true,
    })
    
  $urlRouterProvider.otherwise('/');

  $mdAriaProvider.disableWarnings();

}])
.run([
  '$transitions',
  '$rootScope',
  '$cookies',
  'authApiService',
  '$mdDialog',
  function(
    $transitions,
    $rootScope,
    $cookies,
    authApiService,
    $mdDialog){

    $transitions.onBefore({}, function(transition) {

        if (transition.to().Authenticated && !authApiService.AuthenticatedUser()) {
            return transition.router.stateService.target('base');
        }

        if (!transition.to().Authenticated && authApiService.AuthenticatedUser()) {
            return transition.router.stateService.target('dashboard');
        }
    })

    $transitions.onStart({}, function(transition) {

      if (transition.to().Authenticated) {
        $rootScope.route_loader = true;
        var adminCannotAccess = [];
        var usersCannotAccess = ['user_accounts', 'contract'];
        var $state = transition.router.stateService;
        var auth = $cookies.getObject('auth');
        console.log(auth);

          $rootScope.token = auth.token;
          $rootScope.uid = auth.id;

          return authApiService.getAuthenticatedUser().then(response=>{

            $rootScope.access_degree =  JSON.parse(response.data.degree_access).indexOf("*") > -1? ['Masters', 'Doctorate', 'Undergraduate'] :  JSON.parse(response.data.degree_access);
            $rootScope.username = response.data.name;

            if (response.data.user_type === 'SuperAdmin') {
              $rootScope.contractAccess = true;
              $rootScope.userAccountAccess = true;
              $rootScope.importAccess = true;
              $rootScope.master_doctorate_access = true;
              $rootScope.undergraduate_access = true;
              $rootScope.renewal_access = true;
              return;
            }

            if (response.data.user_type === 'Admin') {
              validateDegree($rootScope.access_degree, adminCannotAccess);
              validateRoute(adminCannotAccess);
              $rootScope.userAccountAccess = true;
              $rootScope.importAccess = true;
            }

            if (response.data.user_type === 'User') {
              validateDegree($rootScope.access_degree, usersCannotAccess);
              validateRoute(usersCannotAccess);
            }

          }, function(err){
            console.log(err);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('ERROR!')
                .textContent('Connection lost')
                .ariaLabel('Access failed')
                .ok('Okay')
            );
          });

          function validateDegree(degree_access, protected_route) {

              $rootScope.master_doctorate_access = ['Masters', 'Doctorate', '*'].some(degree => degree_access.indexOf(degree) !== -1);
              $rootScope.undergraduate_access = ['Undergraduate', '*'].some(degree => degree_access.indexOf(degree) !== -1)
              $rootScope.renewal_access = ['Masters', 'Doctorate', 'Undergraduate', '*'].some(degree => degree_access.indexOf(degree) !== -1)
              
              if (!$rootScope.master_doctorate_access) {
                protected_route.push('add_masteral_doctorate_scholars');
              }

              if (!$rootScope.undergraduate_access ) {
                protected_route.push('add_undergraduate_scholars');
              }

              if (!$rootScope.renewal_access ) {
                protected_route.push('renew_scholars');
              }
              
              return;
          }

          function validateRoute(protected_route) {
            if (protected_route.indexOf(transition.to().name) > -1) {
                transition.abort();
                $rootScope.route_loader = false;
                $state.$current.name ? $state.go($state.$current.name) : $state.go('dashboard') ;
            }
          }
        
      }

    });

    $transitions.onStart({ to: 'base'}, function(transition) {
        $rootScope.route_loader = false;
    });

    $transitions.onSuccess({}, function(transition) {
        $rootScope.route_loader = false;
    });

}]);
