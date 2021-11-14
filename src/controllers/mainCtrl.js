'use strict';
/**
 * @ngdoc function
 * @name psmsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the psmsApp
 */

angular.module('psmsApp')
  .controller('mainCtrl',
    [
      '$scope',
      '$rootScope',
      '$mdSidenav',
      '$mdDialog',
      '$cookies',
      '$location',
      '$timeout',
      '$window',
      'authApiService',
     function (
      $scope,
      $rootScope,
      $mdSidenav,
      $mdDialog,
      $cookies,
      $location,
      $timeout,
      $window,
      authApiService) {

    $scope.toggleSidenav = buildToggler('sidebar-menu');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.navigateTo = function(destination){
      $location.path(destination);
    }

    $scope.logout = function(){
      $rootScope.route_loader = true;
      authApiService.logout().then(response => {
        $cookies.remove('auth');
        $location.path('/');
      }, err =>{
        console.log(err);
      })
    }

}]);

angular
.module('psmsApp').directive('printDoc',[ function(){

    var docDefinition = {
      content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
      ]
    };

  return{
    restrict:'A',
    link: function(scope, elem, atrrs){
      elem.on('click', function(){
        // pdfMake.createPdf(docDefinition).open({}, window.frames['printPdf']);
        // setTimeout(function() {
        //     window.frames['printPdf'].focus();
        //     window.frames['printPdf'].print();
        // }, 500)
        pdfMake.createPdf(docDefinition).print({}, window.frames['printPdf']);
      })
    }
  }
}]);

angular
  .module('psmsApp').directive('resizeDiv', ['$window', function ($window) {
    return function (scope, element, attrs) {

        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': $window.innerHeight,
                'w': $window.innerWidth,
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
              
            scope.resizeDiv = function () {
                return {
                  'min-height': (newValue.h - parseInt(attrs.height)) + 'px',
                  'max-height': (newValue.h - parseInt(attrs.height)) + 'px'
                };
            };
        }, true);

        w.bind('resizeDiv', function () {
            scope.$apply();
        });
    }
}]);

// angular
//   .module('psmsApp').directive('resizeAddScholarsDiv', ['$window', function ($window) {
//     return function (scope, element) {
//         var w = angular.element($window);
//         scope.getWindowDimensions = function () {
//             return {
//                 'h': $window.innerHeight,
//                 'w': $window.innerwidth,
//             };
//         };
//         scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
//             scope.windowHeight = newValue.h;
//             scope.windowWidth = newValue.w;
            
//             scope.resize = function () {
//                 return {
//                   'min-height': (newValue.h - 145) + 'px',
//                   'max-height': (newValue.h - 145) + 'px'
//                 };
//             };
//         }, true);

//         w.bind('resize', function () {
//             scope.$apply();
//         });
//     }
// }]);

angular
  .module('psmsApp').directive('resizeMdList', ['$window', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': $window.innerHeight,
                'w': $window.innerwidth,
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            
            scope.resizeList = function () {
                return {
                  'min-height': (newValue.h - 280) + 'px',
                  'max-height': (newValue.h - 280) + 'px'
                };
            };
        }, true);

        w.bind('resizeList', function () {
            scope.$apply();
        });
    }
}]);

angular
.module('psmsApp').directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
            element.val(null);
        });
    };

    return {
        link: fn_link
    }
}]);

// angular
// .module('psmsApp').factory("fileReader", ['$q', '$log', function($q, $log) {
//   var onLoad = function(reader, deferred, scope) {
//     return function() {
//       scope.$apply(function() {
//         deferred.resolve(reader.result);
//       });
//     };
//   };

//   var onError = function(reader, deferred, scope) {
//     return function() {
//       scope.$apply(function() {
//         deferred.reject(reader.result);
//       });
//     };
//   };

//   var onProgress = function(reader, scope) {
//     return function(event) {
//       scope.$broadcast("fileProgress", {
//         total: event.total,
//         loaded: event.loaded
//       });
//     };
//   };

//   var getReader = function(deferred, scope) {
//     var reader = new FileReader();
//     reader.onload = onLoad(reader, deferred, scope);
//     reader.onerror = onError(reader, deferred, scope);
//     reader.onprogress = onProgress(reader, scope);
//     return reader;
//   };

//   var readAsDataURL = function(file, scope) {
//     var deferred = $q.defer();
//       if(file){
//         var reader = getReader(deferred, scope);
//         reader.readAsDataURL(file);
//       }
//       else{
//         deferred.reject(file);
//       }

//     return deferred.promise;
//   };

//   return {
//     readAsDataUrl: readAsDataURL
//   };
// }]);

const update_scholar = require('../views/update_scholar_photo.html');
const schoolDirective = require('../views/school_modal_directive.html');
const addressDirective = require('../views/address_modal_directive.html');
const courseDirective = require('../views/course_modal_directive.html');

angular.module('psmsApp').directive('editProfilePhoto', function(){
    return{
      restrict:'E',
      templateUrl: update_scholar
    }
});

angular.module('psmsApp').directive('schoolModalDirective', function() {
    return {
        restrict : 'E',
        templateUrl: schoolDirective,
    };
});

angular.module('psmsApp').directive('addressModalDirective', function() {
    return {
        restrict : 'E',
        templateUrl: addressDirective,
    };
});

angular.module('psmsApp').directive('courseModalDirective', function() {
    return {
        restrict : 'E',
        templateUrl: courseDirective,
    };
});

angular.module('psmsApp').directive('whenScrolled', function() {
  return function(scope, element, attr) {
    var raw = element[0];
    element.on('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
});

angular.module('psmsApp').directive('acceptOnlyLetters', function() {
    return {
        restrict : 'A',
        link : function(scope, elem, attrs, ctrl) {
          let regex = /^[a-zA-Z\s]*$/;
          elem.bind('keypress', function(event){
            if (!regex.test(event.key)) {
              event.preventDefault();
            }
          });
        }
    };
});


angular.module('psmsApp').directive('acceptOnlyNumbers', function() {
    return {
        restrict : 'A',
        // require: 'ngModel',
        link: function (scope, elem, attr, ngModelCtrl) {
          // element.bind('keydown', function(evt){
          //     evt = (evt) ? evt : window.event;
          //     var charCode = (evt.which) ? evt.which : evt.keyCode;
          //     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          //         evt.preventDefault();
          //     }
          //     return true;
          // });
          let regex = /^[0-9]*$/;
          elem.bind('keypress', function(event){
            if (!regex.test(event.key)) {
              event.preventDefault();
            }
          });
          elem.bind('paste', function(event){
            event.preventDefault();
          });
            // function fromUser(text) {
            //     if (text) {
            //         var transformedInput = text.replace(/[^0-9]/g, '');
            //         if (transformedInput !== text) {
            //             ngModelCtrl.$setViewValue(transformedInput);
            //             ngModelCtrl.$render();
            //         }
            //         return transformedInput;
            //     }
            //     return undefined;
            // }            
            // ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

angular.module('psmsApp').directive('contractAcademicYear', function() {
    return {
        restrict : 'A',
        link : function(scope, elem, attrs, ctrl) {
          let regex = /^[0-9]*$/;
          elem.bind('keypress', function(event){
            if (!regex.test(event.key)) {
              event.preventDefault();
            }
            else{
              if (event.target.value.length === 4) {
                event.preventDefault();
              }
            }
          });
          elem.bind('paste', function(event){
            event.preventDefault();
          });
        }
    };
});


angular.module('psmsApp').directive('disableInput', function() {
    return {
        restrict : 'A',
        link : function(scope, elem, attrs, ctrl) {
          elem.bind('keydown', function(event){
            event.preventDefault();
          });
          elem.bind('paste', function(event){
            event.preventDefault();
          });
        }
    };
});

angular.module('psmsApp').directive('showChangeView', ['$window', function($window) {
    return {
        restrict : 'A',
        scope:{
          mobile:'='
        },
        link : function(scope, elem, attrs, ctrl) {
          scope.getWidth = function () { return $window.innerWidth; };
          scope.$watch(scope.getWidth, function (newValue, oldValue) {
            scope.mobile = newValue > 959? false : true;
          }, true);
        }
    };
}]);

angular.module('psmsApp').directive('currencyFormatter', ['$filter', function ($filter) {

    var formatter = function (num) {
      return $filter('currency')(num, '', 2);
    };

    return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attr, ngModel) {
      ngModel.$parsers.push(function (str) {
      return str ? Number(str) : '';
      });
      ngModel.$formatters.push(formatter);

      element.bind('blur', function() {
        element.val(formatter(ngModel.$modelValue))
      });
      element.bind('focus', function () {
        element.val(ngModel.$modelValue);
      });
    }
  };
}]);

angular.module('psmsApp').directive('uppercase', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform","uppercase");
        }
    };
});

angular.module('psmsApp').directive('preventPaste', function() {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          element.bind('paste', function(event){
            event.preventDefault();
          });
      }
  };
});

angular.module('psmsApp').directive('yearLength', function() {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          element.bind('keypress', function(event){
            if (event.target.value.length === 4) {
              event.preventDefault();
            }
          });
          element.bind('paste', function(event){
            event.preventDefault();
          });
      }
  };
});