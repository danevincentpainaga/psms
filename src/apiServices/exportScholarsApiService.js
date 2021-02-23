angular.module('psmsApp').factory('exportScholarsApiService', ['$http', '$rootScope', function($http, $rootScope){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getScholarsToExport: function(searched_details){
      return $http.get(baseUrl+'api/export/getScholarsToExport', {
        params: searched_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);