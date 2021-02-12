var app = angular.module('psmsApp');
app.factory('courseApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    getCourses: function(searched){
      return $http.get(baseUrl+'api/getCourses', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    saveCourse: function(course){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveCourse',
        data: course,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
    updateCourse: function(newCourse){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateCourse',
        data: newCourse,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
	}
}]);