angular.module('psmsApp').factory('schoolApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "/";

  return{
    getListOfSchool: function(searched){
      return $http.get(baseUrl+'api/school/getListOfSchool', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    storeSchoolDetails: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/school/storeSchoolDetails',
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
        url: baseUrl+'api/school/updateSchoolDetails',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);