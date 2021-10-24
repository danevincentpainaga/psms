import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp').factory('municipalitiesApiService', ['$http', '$rootScope', function($http, $rootScope){

  return{
    getMunicipalities: function(){
      return $http.get(baseUrl+'api/getMunicipalities', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);