const { result } = require('lodash');
var Swal = require('sweetalert2');
angular.module('psmsApp')
  .factory('swalert', ['$timeout', '$q', 'authApiService', function($timeout, $q, authApiService){
      var self = this;
      self.toastInfo = function(message, nofitificationType, position, timeExpire){
        
        let progress = timeExpire != undefined ? true : false;
        const Toast = Swal.mixin({
          toast: true,
          position: position,
          showConfirmButton: false,
          timer: timeExpire,
          timerProgressBar: progress,
        });

        Toast.fire({
          icon: nofitificationType,
          title: message
        });
      };
      self.dialogBox = function(message, icon, title){
        Swal.fire({
          position: 'center',
          icon: icon,
          title: title,
          text: message,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      };
      self.promptMessageForSupervisor = function(message, icon, title, showCancelButton = false){
        return Swal.fire({
          position: 'center',
          icon: icon,
          title: title,
          text: message,
          confirmButtonText: 'Proceed',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: showCancelButton
        });
      };
      self.supervisorsApproval = function(){
        return Swal.fire({
          title: 'Supervisor\'s Approval',
          html:
          '<label>Email</label><input type="email" id="swal-supervisor-email" class="swal2-input">' +
          '<label>Password</label><input type="password" id="swal-supervisor-password" class="swal2-input">',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            let credentials = {
              email: document.getElementById('swal-supervisor-email').value,
              password: document.getElementById('swal-supervisor-password').value
            };
            
            if(!credentials.email || !credentials.password){
              Swal.showValidationMessage(
                'Request failed: Please complete the form'
              );
              return; 
            }

            return authApiService.supervisorsApproval(credentials).then(response =>{
              return response.data;
            }, err => {
              Swal.showValidationMessage(
                `Request failed: ${err.data.message}`
              );
            });
          }
        });
      };
      self.confirm = function(obj, method, title, message, icontype, timeout, ctrl){
        Swal.fire({
          title: title,
          text: message,
          icon: icontype,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            if (!timeout) {
              method(obj);
            }
            else{
              ctrl.importBtn = 'Uploading...';
              ctrl.circular_message = 'Uploading';
              ctrl.show_spinner = true;
              $timeout(function() { 
                method(obj);
              }, timeout);
            }
          }
        });
      };
      self.deleteInfo = function(obj, method){
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            method(obj);
          }
        });
      };
    
      return self;
}]);