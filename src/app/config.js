angular
.module('psmsApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngMaterial',
  'chart.js',
  'ui.grid',
  'ui.grid.exporter',
  'ui.grid.importer',
  'ui.grid.resizeColumns',
  'ui.grid.moveColumns'
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
      templateUrl: 'src/views/address.html',
      controller: 'addressCtrl',
      controllerAs: 'ad',
      Authenticated: true,
    })
    .state('schools', {
      url: '/schools',
      templateUrl: 'src/views/schools.html',
      controller: 'schoolsCtrl',
      controllerAs: 's',
      Authenticated: true,
    })
    .state('course', {
      url: '/course',
      templateUrl: 'src/views/course.html',
      controller: 'courseCtrl',
      controllerAs: 'cc',
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
    .state('import', {
      url: '/import',
      templateUrl: 'src/views/import.html',
      controller: 'importScholarsCtrl',
      controllerAs: 'ic',
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

        $rootScope.token = auth.success;

        return authApiService.getAuthenticatedUser().then(response=>{

          $rootScope.access_degree = JSON.parse(response.data.degree_access);
          $rootScope.username = response.data.name;
          let degree_access = JSON.parse(response.data.degree_access);

          if (response.data.user_type === 'User') {

            validateDegree(degree_access, usersCannotAccess);
            validateRoute(usersCannotAccess);
            $rootScope.isAdmin = false;

          }
          else{

            validateDegree(degree_access, adminCannotAccess);
            validateRoute(adminCannotAccess);
            $rootScope.isAdmin = true;
            
          }

        });

        function validateDegree(degree_access, protected_route) {
            if (degree_access.indexOf('Masters') == -1 || degree_access.indexOf('Doctorate') == -1) {

                protected_route.push('add_masteral_doctorate_scholars');
                $rootScope.master_doctorate_access = false;
                return ;
                
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

  });

  $transitions.onStart({ to: 'base'}, function(transition) {
      $rootScope.route_loader = false;
  });

  $transitions.onSuccess({}, function(transition) {
      $rootScope.route_loader = false;
  });

}]);
