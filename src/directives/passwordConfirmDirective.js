var passwordConfirm = require('../views/password_confirm_directive.html');

angular
.module('psmsApp').directive('passwordConfirm', ['authApiService', 'swalert', function(authApiService, swalert){
  return{
    restrict:'E',
    templateUrl: passwordConfirm, 
    scope: {
        callFn: "&",
        closeFn: "&"
    },
    link: function (scope, element) {
        scope.ConfirmText = 'Confirm';
        scope.confirmAccess = function(){
            if (scope.password) {
                scope.ConfirmText = 'Confirming...';
                console.log(scope.password);
                authApiService.confirmIsAdminAccess({password: scope.password}).then(response => {
                    scope.callFn();
                    scope.closeFn();
                    scope.ConfirmText = 'Confirm';
                }, err=>{
                    swalert.dialogBox(err.data.message, 'error', 'Failed');
                    console.log(err);
                    scope.ConfirmText = 'Confirm';
                });
            }
        }
    }
  }
}]);