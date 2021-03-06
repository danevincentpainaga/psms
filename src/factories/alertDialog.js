var Swal = require('sweetalert2');
angular.module('psmsApp')
  .factory('swalert', ['$http', function($http){
    return{
      toastInfo: function(message, nofitificationType, position, timeExpire){
        let time;
        timeExpire != undefined ? time = timeExpire : time = false;
        const Toast = Swal.mixin({
          toast: true,
          position: position,
          showConfirmButton: false,
          timer: timeExpire
        });

        Toast.fire({
          icon: nofitificationType,
          title: message
        });
      },
      dialogBox: function(message, icon, title){
        Swal.fire({
          position: 'center',
          icon: icon,
          title: title,
          text: message,
        });
      },
      confirm: function(obj, method, title, message, icontype){
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
            method(obj);
          }
        });
      },
      deleteInfo: function(obj, method){
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
      },
    }
}]);