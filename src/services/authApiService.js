angular.module('psmsApp')
  .factory('authApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
   
  var baseUrl = "http://localhost:8000/";
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

  }
}]);