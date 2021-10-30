import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp')
  .factory('governorService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){
    return{
      updateGovernor: function(details){
        return $http({
          method:'POST',
          url: baseUrl+'api/governor/updateGovernor',
          data: details,
          headers: {
            "Content-Type": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          }
        });
      },
      getGovernorDetails: function(){
        return $http.get(baseUrl+'api/governor/getGovernorDetails', {
          headers: {
            "Accept": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          }
        });
      }
    }
}]);