angular
.module('psmsApp').directive('colorContractStatus', function(){
  return{
    restrict:'A',
    link: function(scope, elem, attrs){
      attrs.$observe('colorContractStatus', function(){
        switch(attrs.colorContractStatus){
          case 'Approved':
                    elem.css({"background": "rgb(60 87 239)", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'Pre-Approved':
                    elem.css({"background": "rgb(7 169 100)", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'Pending':
                    elem.css({"background": "rgb(235 160 53)", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'In-Active':
                    elem.css({"background": "rgb(243 48 48)", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break;
          case 'Queued':
                    elem.css({"background": "rgb(231 71 220)", "padding": "2px 8px", "border-radius": "5px", "color": "#ffff" });
                    break; 
        }
      });

    }
  }
});