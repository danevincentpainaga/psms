angular.module('psmsApp')
  .factory('academicSemesterYearApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "/";

  return{
   getAcademicYearList: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/academic/getAcademicYearList',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
   storeAcademicYearList: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/academic/storeAcademicYearList',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
   updateAcademicYearList: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/academic/updateAcademicYearList',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    }
    

	}
}]);