var app = angular.module('psmsApp');
app.factory('schoolApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getSchools: function(searched){
      return $http({
        method:'GET',
        url: baseUrl+'api/getSchools/'+searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);