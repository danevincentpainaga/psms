import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp')
  .factory('usersApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
    return{
      getUserAccounts: function(searched){
        return $http.get(baseUrl+'api/users/getUserAccounts', {
          params: searched,
          headers: {
            "Content-Type": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          }
        });
      },
      createUsersAccount: function(userDetails){
        return $http({
          method:'POST',
          url: baseUrl+'api/users/createUsersAccount',
          data: userDetails,
          headers: {
            "Content-Type": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          }
        });
      },
    }
}]);