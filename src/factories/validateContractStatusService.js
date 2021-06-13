angular.module('psmsApp').factory('validateContractStatusService', ['$rootScope', '$state', '$mdDialog',  function($rootScope, $state, $mdDialog){
  return {
  	checkStatus: function(response){
	     if (response.contract_state === 'Closed') {
	      $mdDialog.show(
	        $mdDialog.alert()
	          .parent(angular.element(document.body))
	          .clickOutsideToClose(true)
	          .title('Not Allowed!')
	          .textContent('Contract is now closed.')
	          .ariaLabel('Access failed')
	          .ok('Okay')
	      );
	      $state.go($state.$current.name);
	      $rootScope.route_loader = false;
	    }
	    else{
	      return response;
	    }
  	}
  }
}]);