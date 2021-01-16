var app = angular.module('psmsApp');
app.factory('provinceApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getProvinces: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getProvinces',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);