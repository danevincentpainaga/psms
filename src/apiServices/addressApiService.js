angular.module('psmsApp').factory('addressApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "/";

  return{
    getAddresses: function(searched){
      return $http.get(baseUrl+'api/address/getAddresses', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    storeAddress: function(address){
      return $http({
        method:'POST',
        url: baseUrl+'api/address/storeAddress',
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
        url: baseUrl+'api/address/updateAddress',
        data: newAddress,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
	}
}]);