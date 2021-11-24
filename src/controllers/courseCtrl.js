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
	// cc.degrees = ['Undergraduate', 'Masters', 'Doctorate'];

	$scope.$watch('cc.searched_course', debounce(function(){
		cc.searching = true;
		getCoursesList(cc.searched_course);
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
		cc.selected_degree = selected_course.course_degree;
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
				course_degree: cc.selected_degree,
			};

			if (!cc.isUpdating) {
				storeCourse(course_details);
			}
			else{
				cc.saveUpdateBtnText = 'Updating...';
				updateCourse(course_details);
			}
		}
	}

	function storeCourse(course_details){
		courseApiService.storeCourse(course_details).then(response => {
			cc.courses.push(response.data);
			clearInputs();
			cc.saving_updating = false;
			swalert.dialogBox('Course saved.', 'success',  'successful');
		}, err => {
			console.log(err);
			cc.saving_updating = false;
			swalert.dialogBox(err.data, 'error', 'Failed');
		})
	}

	function updateCourse(course_details){

		Object.assign(course_details, { course_id: cc.course_id });

		courseApiService.updateCourse(course_details).then(response => {
			cc.binded_course.course = response.data.course;
			cc.saving_updating = false;
			cc.saveUpdateBtnText = 'Update';
			swalert.dialogBox('Course updated.', 'success',  'Updated');
		}, err => {
			console.log(err);
			swalert.dialogBox(err.data, 'error', 'Failed');
		})
	}

	function getCoursesList(searched){
		courseApiService.getCoursesList({searched: searched}).then(response=>{
			console.log(response.data.data);
			cc.courses = response.data.data;
			cc.searching = false;
			cc.course_list_loaded = true;
		}, err => {
			console.log(err);
		});
	}

	function clearInputs(){
		cc.binded_course = "";
		cc.course = "";
		cc.selected_degree = "";
		cc.courseForm.$setPristine();
		cc.courseForm.$setUntouched();
	}

}]);