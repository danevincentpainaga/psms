angular.module('psmsApp').factory('importScholarApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "/";

  return{
    getAllScholars: function(degree){
      return $http.get(baseUrl+'api/import/getAllScholars', {
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
    getCourses: function(degree){
      return $http.get(baseUrl+'api/import/getCourses', {
        params: degree,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    importScholars: function(importedScholars){
      return $http({
        method:'POST',
        url: baseUrl+'api/import/importScholars',
        data: importedScholars,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);