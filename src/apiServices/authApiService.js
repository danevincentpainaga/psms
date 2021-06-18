import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp')
  .factory('authApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
   
  var userData;

  return{
    validateLogin: function(credData){
      return $http({
        method:'POST',
        url: baseUrl+'api/login',
        data: credData,
        headers: {
          Accept: "application/json", 
        }
      });
    },
    AuthenticatedUser: function(){
      var status = $cookies.get('auth');
        if(status){
          return true;
        }else{
          return false;
        }
    },
    getAuthenticatedUser: function(){
        
      let defer = $q.defer();

      if (userData) {
          defer.resolve(userData);
          return defer.promise;
      }
      
      return $http.get(baseUrl+'api/getAuthenticatedUser', {
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
      
    },
    getCsrfToken: function(){
      return $http.get(baseUrl+'sanctum/csrf-cookie', {
        headers: {
          Accept: "application/json"
        }
      });
    },
    logout: function(credData){
      return $http({
        method:'POST',
        url: baseUrl+'api/logout',
        data: credData,
        headers: {
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    confirmIsAdminAccess: function(password){
      return $http({
        method:'POST',
        url: baseUrl+'api/confirmIsAdminAccess',
        data: password,
        headers: {
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
  }
}]);