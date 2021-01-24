var app = angular.module('psmsApp');
app.factory('academicContractService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){

  var baseUrl = "http://localhost:8000/";
  
  return{
    getAcademicContractDetails: function(searched){
      return $http({
        method:'GET',
        url: baseUrl+'api/getAcademicContractDetails',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    setContract: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/setContract',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    closeContract: function(){
      return $http({
        method:'POST',
        url: baseUrl+'api/closeContract',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    openContract: function(){
      return $http({
        method:'POST',
        url: baseUrl+'api/openContract',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    } 
	}
}]);