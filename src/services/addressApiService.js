var app = angular.module('psmsApp');
app.factory('addressApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getAddresses: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getAddresses',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);