import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp').factory('courseApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  // var baseUrl = "/";

  return{
    getCourses: function(searched){
      return $http.get(baseUrl+'api/course/getCourses', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getCoursesList: function(searched){
      return $http.get(baseUrl+'api/course/getCoursesList', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    storeCourse: function(course){
      return $http({
        method:'POST',
        url: baseUrl+'api/course/storeCourse',
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
        url: baseUrl+'api/course/updateCourse',
        data: newCourse,
        headers: {
          Accept: "application/json",
          Authorization : 'Bearer '+ $rootScope.token 
        }
      });
    },
	}
}]);