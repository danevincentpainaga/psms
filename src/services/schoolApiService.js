angular.module('psmsApp').factory('schoolApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getListOfSchool: function(searched){
      return $http.get(baseUrl+'api/getListOfSchool', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    saveSchoolDetails: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveSchoolDetails',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateSchoolDetails: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateSchoolDetails',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);