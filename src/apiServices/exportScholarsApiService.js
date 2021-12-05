import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp').factory('exportScholarsApiService', ['$http', '$rootScope', function($http, $rootScope){
	 
  // var baseUrl = "/";

  return{
    getScholarsToExport: function(){
      return $http.get(baseUrl+'api/export/getScholarsToExport', {
        responseType: "blob",
        headers: {
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);