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
    .state('undergraduate', {
      url: '/undergraduate',
      views:{
        '':{
          templateUrl: 'src/views/undergraduate.html',
        },
        'undergraduate-view@undergraduate':{
          templateUrl: 'src/views/undergraduate_list.html',
          controller: 'undergraduateCtrl',
          controllerAs: 'uc'
        }
      },

      Authenticated: true,
    })
    .state('masteral_doctorate', {
      url: '/masteral_doctorate',
      views:{
        '':{
          templateUrl: 'src/views/masteral_doctorate.html',
        },
        'masteral_doctorate-view@masteral_doctorate':{
          templateUrl: 'src/views/masteral_doctorate_list.html',
        }
      },
      Authenticated: true,
    })
    .state('undergraduate.add_undergraduate_scholars', {
      url: '/add_undergraduate_scholars',
      views:{
        '':{
          templateUrl: 'src/views/undergraduate.html',
        },
        'undergraduate-view@undergraduate':{
          templateUrl: 'src/views/add_undergraduate_scholars.html',
          controller: 'addUndergraduateCtrl',
          controllerAs: 'ac'
        }
      },
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
    .state('masteral_doctorate.add_masteral_doctorate_scholars', {
      url: '/add_masteral_doctorate_scholars',
      views:{
        '':{
          templateUrl: 'src/views/masteral_doctorate.html',
        },
        'masteral_doctorate-view@masteral_doctorate':{
          templateUrl: 'src/views/add_masteral_doctorate_scholars.html',
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
      controllerAs: 'sc',
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


require('../services/alertDialog.js');
require('../factories/momentFactory.js');
require('../services/loginApiService.js');
require('../services/schoolApiService.js');
require('../services/addressApiService.js');
require('../services/scholarApiService.js');
require('../services/academicContractService.js');

require('../controllers/mainCtrl.js');
require('../controllers/loginCtrl.js');
require('../controllers/addUndergraduateCtrl.js');
require('../controllers/undergraduateCtrl.js');
require('../controllers/schoolsCtrl.js');
require('../controllers/addSchoolCtrl.js');
require('../controllers/updateSchoolCtrl.js');

