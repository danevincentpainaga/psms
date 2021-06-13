import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp')
  .factory('usersApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  // var baseUrl = "/";

  return{
   getUserAccounts: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getUserAccounts',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    }

	}
}]);