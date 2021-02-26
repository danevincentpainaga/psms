angular.module('psmsApp').factory('dashboardApiService', ['$http', '$rootScope', function($http, $rootScope){
  
  var baseUrl = "/";

  return{
    undergraduateScholarsCount: function(){
      return $http.get(baseUrl+'api/dashboard/undergraduateScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    mastersScholarsCount: function(){
      return $http.get(baseUrl+'api/dashboard/mastersScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getApprovedScholarsCount: function(){
      return $http.get(baseUrl+'api/dashboard/getApprovedScholarsCount', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewOldTotalPerDegree: function(){
      return $http.get(baseUrl+'api/dashboard/getNewOldTotalPerDegree', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getContractStatusTotalPerDegree: function(){
      return $http.get(baseUrl+'api/dashboard/getContractStatusTotalPerDegree', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);