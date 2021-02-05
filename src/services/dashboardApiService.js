angular.module('psmsApp').factory('dashboardApiService', ['$http', '$rootScope', function($http, $rootScope){
  
  var baseUrl = "http://localhost:8000/";

  return{
    newScholarsCount: function(){
      return $http.get(baseUrl+'api/newScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    oldScholarsCount: function(){
      return $http.get(baseUrl+'api/oldScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);