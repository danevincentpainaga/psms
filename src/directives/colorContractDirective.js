angular
.module('psmsApp').directive('colorContract', function(){
  return{
    restrict:'A',
    link: function(scope, elem, attrs){
      
      attrs.$observe('colorContract', function(){
        switch(attrs.colorContract){
          case 'Open':
                    elem.css({"background": "rgb(78 106 235)", "padding": "1px 7px", "border-radius": "3px", "color": "#ffff" });
                    break;
          case 'Closed':
                    elem.css({"background": "rgb(243 48 48)", "padding": "1px 7px", "border-radius": "3px", "color": "#ffff" });
                    break;
          case 'Selected':
                    elem.css({"background": "rgb(74 165 55)", "padding": "2px 8px", "border-radius": "3px", "color": "#ffff" });
                    break;
          case 'Available':
                    elem.css({"background": "rgb(60 87 239)", "padding": "2px 8px", "border-radius": "3px", "color": "#ffff" });
                    break;
        }
      });

    }
  }
});