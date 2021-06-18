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
                swalert.toastInfo('Confirming...', 'info', 'top');
                authApiService.confirmIsAdminAccess({password: scope.password}).then(response => {
                    scope.callFn();
                    scope.closeFn();
                    scope.ConfirmText = 'Confirm';
                }, err=>{
                    swalert.toastInfo(err.data.message, 'error', 'top');
                    scope.ConfirmText = 'Confirm';
                });
            }
        }
    }
  }
}]);