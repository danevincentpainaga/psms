var app = angular.module('psmsApp');
app.factory('schoolApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getSearchedSchool: function(searched){
      return $http({
        method:'GET',
        url: baseUrl+'api/getSearchedSchool/'+searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

    getListOfSchool: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getListOfSchool',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);