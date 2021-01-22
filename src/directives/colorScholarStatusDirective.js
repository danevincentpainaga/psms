angular
.module('psmsApp').directive('colorScholarStatus', function(){
  return{
    restrict:'A',
    link: function(scope, elem, attrs){
      attrs.$observe('colorScholarStatus', function(){
        switch(attrs.colorScholarStatus){
          case 'NEW':
                    elem.css({"background": "#47cd47", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'OLD':
                    elem.css({"background": "#0f93ff", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
        }
      });

    }
  }
});