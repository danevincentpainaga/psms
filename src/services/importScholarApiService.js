angular.module('psmsApp').factory('importScholarApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getAllScholars: function(degree){
      return $http.get(baseUrl+'api/getAllScholars', {
        params: degree,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getAddresses: function(municipality){
      return $http.get(baseUrl+'api/import/getAddresses', {
        params: municipality,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    importScholars: function(importedScholars){
      return $http({
        method:'POST',
        url: baseUrl+'api/importScholars',
        data: importedScholars,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);