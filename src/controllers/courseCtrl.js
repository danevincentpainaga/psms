'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:courseCtrl
 * @description
 * # courseCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('courseCtrl',['$scope', 'municipalitiesApiService', 'courseApiService', 'debounce', 'swalert', '$mdSidenav',
	function ($scope, municipalitiesApiService, courseApiService, debounce, swalert, $mdSidenav) {

	var cc = this;
	cc.isUpdating = false;

	$scope.$watch('cc.searched_course', debounce(function(){
		cc.searching = true;
		getCourses(cc.searched_course);
	}, 500), true);

	cc.add = function(){
		cc.isUpdating = false;
		cc.saveUpdateBtnText = 'Save';
		cc.labelText = 'Add';
		$mdSidenav('addUpdateCourse').toggle();
	}

	cc.edit = function(selected_course){
		cc.binded_course = selected_course;
		cc.course_id = selected_course.course_id;
		cc.course = selected_course.course;
		cc.isUpdating = true;
		cc.saveUpdateBtnText = 'Update';
		cc.labelText = 'Update';
		$mdSidenav('addUpdateCourse').toggle();
	}

	cc.close = function(){
		clearInputs();
		$mdSidenav('addUpdateCourse').toggle();
	}

	cc.saveUpdateCourse = function(){

		if (cc.course) {

			cc.saving_updating = true;

			let course_details = {
				course: cc.course.toUpperCase(),
			};

			if (!cc.isUpdating) {
				saveCourse(course_details);
			}
			else{
				updateCourse(course_details);
			}
		}
	}


	function saveCourse(course_details){
		courseApiService.saveCourse(course_details).then(response => {
			cc.courses.push(response.data);
			clearInputs();
			cc.saving_updating = false;
			swalert.toastInfo('Course saved.', 'success', 'top-right', 4000);
		}, err => {
			console.log(err);
			swalert.toastInfo(err.data, 'error', 'top-right');
		})
	}

	function updateCourse(course_details){

		Object.assign(course_details, { course_id: cc.course_id });

		courseApiService.updateCourse(course_details).then(response => {
			cc.binded_course.course = response.data.course;
			cc.saving_updating = false;
			swalert.toastInfo('Course updated.', 'success', 'top-right', 4000);
		}, err => {
			console.log(err);
			swalert.toastInfo(err.data, 'error', 'top-right');
		})
	}

	function getCourses(searched){
		courseApiService.getCourses({searched: searched}).then(response=>{
			cc.courses = response.data;
			cc.searching = false;
			cc.course_list_loaded = true;
		}, err => {
			console.log(err);
		});
	}

	function clearInputs(){
		cc.binded_course = "";
		cc.course = "";
	}

}]);