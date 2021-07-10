angular
.module('psmsApp').directive('colorDegree', function(){
  return{
    restrict:'A',
    link: function(scope, elem, attrs){
      
      attrs.$observe('degree', function(){
        switch(attrs.degree){
          case 'Undergraduate':
                    elem.css({"background": "rgb(74 165 55)", "padding": "2px 8px", "border-radius": "3px", "color": "#ffff" });
                    break;
          case 'Masters':
                    elem.css({"background": "#0fb1df", "padding": "2px 8px", "border-radius": "3px", "color": "#ffff" });
                    break;
          case 'Doctorate':
                    elem.css({"background": "#b3009fad", "padding": "2px 8px", "border-radius": "3px", "color": "#ffff" });
                    break;
        }
      });

    }
  }
});