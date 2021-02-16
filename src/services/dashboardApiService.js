angular.module('psmsApp').factory('dashboardApiService', ['$http', '$rootScope', function($http, $rootScope){
  
  var baseUrl = "http://localhost:8000/";

  return{
    undergraduateScholarsCount: function(){
      return $http.get(baseUrl+'api/undergraduateScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    mastersScholarsCount: function(){
      return $http.get(baseUrl+'api/mastersScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getApprovedScholarsCount: function(){
      return $http.get(baseUrl+'api/getApprovedScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);