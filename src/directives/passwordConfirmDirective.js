var passwordConfirm = require('../views/password_confirm_directive.html');

angular
.module('psmsApp').directive('passwordConfirm', ['authApiService', 'swalert', '$mdDialog', function(authApiService, swalert, $mdDialog){
  return{
    restrict:'E',
    templateUrl: passwordConfirm, 
    scope: {
        callFn: '&',
        closeFn: '&'
    },
    link: function (scope, element) {
        scope.ConfirmText = 'Confirm';
        scope.confirmAccess = function(){
            if (scope.password) {
                scope.disable_confirm = true;
                scope.ConfirmText = 'Confirming...';
                swalert.toastInfo('Confirming...', 'info', 'top');
                authApiService.confirmIsAdminAccess({password: scope.password}).then(response => {
                    scope.callFn();
                    scope.closeDialog();
                    scope.ConfirmText = 'Confirm';
                    scope.disable_confirm = false;
                }, err=>{
                    swalert.toastInfo(err.data.message, 'error', 'top');
                    scope.ConfirmText = 'Confirm';
                    scope.disable_confirm = false;
                });
            }
        }

        scope.closeDialog = function(){
            scope.password = '';
            $mdDialog.hide();
        }
    }
  }
}]);