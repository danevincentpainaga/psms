var app = angular.module('psmsApp');
app.factory('scholarApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    saveScholar: function(scholar_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveScholar',
        data: scholar_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getMotherList: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getMotherList/',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getFatherList: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getFatherList/',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewScholars: function(searched){
      return $http({
        method:'POST',
        url: baseUrl+'api/getNewScholars',
        data: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getScholars: function(searched_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/getScholars',
        data: searched_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
	}
}]);