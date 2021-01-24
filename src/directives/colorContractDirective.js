angular
.module('psmsApp').directive('colorContract', function(){
  return{
    restrict:'A',
    link: function(scope, elem, attrs){
      
      attrs.$observe('colorContract', function(){
        switch(attrs.colorContract){
          case 'Open':
                    elem.css({"background": "rgb(78 106 235)", "padding": "1px 7px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'Closed':
                    elem.css({"background": "rgb(243 48 48)", "padding": "1px 7px", "border-radius": "5px", "color": "#ffff" });
                    break;
        }
      });

    }
  }
});