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

	}
}]);