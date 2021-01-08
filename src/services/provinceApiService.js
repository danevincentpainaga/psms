var app = angular.module('psmsApp');
app.factory('provinceApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getProvinces: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getProvinces',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);