var app = angular.module('psmsApp');
app.factory('addressApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getAddresses: function(searched){
      return $http.get(baseUrl+'api/getAddresses', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    saveAddress: function(address){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveAddress',
        data: address,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
    updateAddress: function(newAddress){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateAddress',
        data: newAddress,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
	}
}]);