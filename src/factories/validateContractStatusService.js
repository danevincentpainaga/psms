angular.module('psmsApp').factory('validateContractStatusService', ['$rootScope', '$state', '$mdDialog',  function($rootScope, $state, $mdDialog){
  return {
  	checkStatus: function(response){
		if(response.status === 200){
			if (response.data[0].contract_state === 'Closed') {
				this.dialog('Not Allowed!', 'Contract is now closed.')
				$state.go($state.$current.name);
				$rootScope.route_loader = false;
			}else{
				return response.data[0];
			}
		}
		else if(response.status === 400){
			this.dialog('Not Allowed!', response.data.message);
			$state.go($state.$current.name);
			$rootScope.route_loader = false;			
		}else{
			this.dialog(response.statusText, 'Connection lost.');
			$state.go($state.$current.name);
			$rootScope.route_loader = false;			
		}
	    
  	},
	dialog: function(title, message){
		$mdDialog.show(
	        $mdDialog.alert()
	          .parent(angular.element(document.body))
	          .clickOutsideToClose(true)
	          .title(title)
	          .textContent(message)
	          .ariaLabel('Access failed')
	          .ok('Okay')
	      );
	}
  }
}]);