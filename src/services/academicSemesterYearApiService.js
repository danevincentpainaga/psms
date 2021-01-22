angular.module('psmsApp')
  .factory('academicSemesterYearApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
   getAcademicYearList: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getAcademicYearList',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
   saveAcademicYearList: function(details){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveAcademicYearList',
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
        url: baseUrl+'api/updateAcademicYearList',
        data: details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    }
    

	}
}]);