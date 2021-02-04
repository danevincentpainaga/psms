'use strict';
/**
 * @ngdoc function
 * @name psmsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the psmsApp
 */

angular.module('psmsApp')
  .controller('mainCtrl',['$scope', '$rootScope', '$mdSidenav', '$mdDialog', '$cookies', '$location', '$timeout', 'authApiService',
     function ($scope, $rootScope, $mdSidenav, $mdDialog, $cookies, $location, $timeout, authApiService) {

    $scope.toggleSidenav = buildToggler('sidebar-menu');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.navigateTo = function(destination){
      $location.path(destination);
      $timeout($scope.toggleSidenav(), 1200);
    }

    $scope.logout = function(){
      $rootScope.route_loader = true;
      authApiService.logout().then(response => {
        $cookies.remove('auth');
        $timeout(function() { $location.path('/') }, 1000);
      }, err =>{
        console.log(err);
      })
    }

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    
    // Simulate async data update
    $timeout(function () {
      $scope.data = [
        [28, 48, 40, 19, 86, 27, 90],
        [65, 59, 80, 81, 56, 55, 40]
      ];
    }, 3000);

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
            
            scope.resizeDiv = function () {
                return {
                  'min-height': (newValue.h - 181) + 'px',
                  'max-height': (newValue.h - 181) + 'px'
                };
            };
        }, true);

        w.bind('resizeDiv', function () {
            scope.$apply();
        });
    }
}]);

angular
  .module('psmsApp').directive('resizeAddScholarsDiv', ['$window', function ($window) {
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
            
            scope.resize = function () {
                return {
                  'min-height': (newValue.h - 162) + 'px',
                  'max-height': (newValue.h - 162) + 'px'
                };
            };
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]);

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
                  'min-height': (newValue.h - 297) + 'px',
                  'max-height': (newValue.h - 297) + 'px'
                };
            };
        }, true);

        w.bind('resizeList', function () {
            scope.$apply();
        });
    }
}]);


angular
.module('psmsApp').directive('editScholar',[ function($mdSidenav){
  return{
    restrict:'E',
    scope:{
      scholar:'=',
      updated:'='
    },
    controller:'editScholarCtrl',
    controllerAs: 'ec',
    templateUrl: 'src/views/edit_scholar.html',
  }
}]);

angular
.module('psmsApp').directive('hideBtnActions',[ function(){
  return{
    restrict:'A',
    link: function(scope, elem, atrrs){
      atrrs.$observe('hideBtnActions', function(n, o) {
        if (n === 'Closed') {
          $(elem).hide();
        }
      });
    }
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

angular
.module('psmsApp').factory("fileReader", function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();
      if(file){
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
      }
      else{
        deferred.reject(file);
      }

    return deferred.promise;
  };

  return {
    readAsDataUrl: readAsDataURL
  };
});


angular
  .module('psmsApp').directive('editProfilePhoto',[ function(){
    return{
      restrict:'E',
      templateUrl:'src/views/test_update_Scholar.html',
    }
}]);