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
      successAlert: function(message){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success!',
          text: message,
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