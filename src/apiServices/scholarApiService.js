angular.module('psmsApp').factory('scholarApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "/";

  return{
    storeNewScholarDetails: function(scholar_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/scholars/storeNewScholarDetails',
        data: scholar_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateScholarDetails: function(scholar_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/scholars/updateScholarDetails',
        data: scholar_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateScholarParentsDetails: function(parents_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/parents/updateScholarParentsDetails',
        data: parents_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getMotherList: function(searched){
      return $http.get(baseUrl+'api/parents/getMotherList', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getFatherList: function(searched){
      return $http.get(baseUrl+'api/parents/getFatherList', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewUndergraduateScholars: function(searched){
      return $http.get(baseUrl+'api/scholars/getNewUndergraduateScholars', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewMastersDoctorateScholars: function(searched){
      return $http.get(baseUrl+'api/scholars/getNewMastersDoctorateScholars', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getScholars: function(searched_details, page){
      return $http.get(baseUrl+'api/scholars/getScholars?page='+page, {
        params: searched_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getDegrees: function(){
      return $http.get(baseUrl+'api/scholars/getDegrees', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    uploadProfilePic: function(image){
      return $http({
        method:'POST',
        url: baseUrl+'api/scholars/uploadProfilePic',
        data: image,
        headers: {
          "Content-Type": undefined,
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },

	}
}]);