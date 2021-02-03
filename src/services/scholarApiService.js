var app = angular.module('psmsApp');
app.factory('scholarApiService', ['$http', '$cookies', '$rootScope', '$q', function($http, $cookies, $rootScope, $q){
	 
  var baseUrl = "http://localhost:8000/";

  return{
    saveNewScholarDetails: function(scholar_details){
      return $http({
        method:'POST',
        url: baseUrl+'api/saveNewScholarDetails',
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
        url: baseUrl+'api/updateScholarDetails',
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
        url: baseUrl+'api/updateScholarParentsDetails',
        data: parents_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getMotherList: function(searched){
      return $http.get(baseUrl+'api/getMotherList', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getFatherList: function(searched){
      return $http.get(baseUrl+'api/getFatherList', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewUndergraduateScholars: function(searched){
      return $http.get(baseUrl+'api/getNewUndergraduateScholars', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getNewMastersDoctorateScholars: function(searched){
      return $http.get(baseUrl+'api/getNewMastersDoctorateScholars', {
        params: searched,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getScholars: function(searched_details, page){
      return $http.get(baseUrl+'api/getScholars?page='+page, {
        params: searched_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getScholarsToExport: function(searched_details){
      return $http.get(baseUrl+'api/getScholarsToExport', {
        params: searched_details,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getDegrees: function(){
      return $http.get(baseUrl+'api/getDegrees', {
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },


	}
}]);