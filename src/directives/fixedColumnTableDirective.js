angular
.module('psmsApp').directive('fixedColumnTable', ['$timeout', function($timeout){
  return{
    restrict:'A',
    scope: {
        fixedColumns: "@"
    },
    link: function (scope, element) {
        var container = element[0];

        function activate() {
            
            container.addEventListener('scroll', function () {

                var x = container.scrollLeft;
                var y = container.scrollTop;

                //Update the left header positions when the container is scrolled
                container.querySelectorAll('tbody tr').forEach(function (leftHeader) {
                    leftHeader.querySelectorAll('td')[0].style.transform = translate(x, 0);
                    leftHeader.querySelectorAll('td')[1].style.transform = translate(x, 0);
                });

                //Update headers that are part of the header and the left column
                container.querySelectorAll('thead tr').forEach(function (crossHeader) {
                    crossHeader.querySelectorAll('th')[0].style.transform = translate(x, 0);
                    crossHeader.querySelectorAll('th')[1].style.transform = translate(x, 0);
                    crossHeader.style.transform = translate(0, y);
                });

            });

            function translate(x, y) {
                return 'translate(' + x + 'px, ' + y + 'px)';
            }

        }

        $timeout(function () {
            activate();
        }, 0);

    }
  }
}]);