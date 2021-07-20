angular
.module('psmsApp').directive('fixedColumnTable', ['$timeout', '$window', function($timeout, $window){
  return{
    restrict:'A',
    scope: {
        fixedColumns: "@"
    },
    link: function (scope, element) {

        var container = element[0];

        scope.getWidth = function () {
            return  $window.innerWidth;
        };

        function activate() {
            
            console.log(scope.fixedColumns);
            angular.element(container).on('scroll', function () {

                var x = container.scrollLeft;
                var y = container.scrollTop;

                //Update the left header positions when the container is scrolled
                container.querySelectorAll('tbody tr').forEach(function (leftHeader) {
                    leftHeader.querySelectorAll('td')[0].style.transform = translate(x, 0);
                    if (!scope.mobile) {
                        leftHeader.querySelectorAll('td')[1].style.transform = translate(x, 0);
                    }
                });

                //Update headers that are part of the header and the left column
                container.querySelectorAll('thead tr').forEach(function (crossHeader) {
                    crossHeader.querySelectorAll('th')[0].style.transform = translate(x, 0);
                   if (!scope.mobile) {
                        crossHeader.querySelectorAll('th')[1].style.transform = translate(x, 0);
                    }
                    crossHeader.style.transform = translate(0, y);
                });

            });

            function translate(x, y) {
                return 'translate(' + x + 'px, ' + y + 'px)';
            }
        }

        scope.$watch(scope.getWidth, function (newValue, oldValue) {
            scope.mobile = newValue > 695 ? false : true;
            $timeout(function () {
                activate();
            });
        }, true);

    }
  }
}]);