const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

angular.module('psmsApp').factory('printContract', ['$timeout','$q', function($timeout, $q) {
  
  var self = this;

  self.print = function(scholarDetails, ctrl){

    let docDefinition = {
        content: [
          {text: 'NAME: '+scholarDetails.firstname.toUpperCase()+" "+scholarDetails.lastname.toUpperCase()+", "+scholarDetails.middlename.toUpperCase()},
        ]
      };

    let pdfDocGenerator = pdfMake.createPdf(docDefinition);

    if (self.isMobile()) {
      // This print is for mobile browsers
      pdfDocGenerator.print({}, window);
    }else{
      // This print is for desktop browsers
      pdfDocGenerator.print({}, window.frames['printPdf']);
    }
    
    pdfDocGenerator.getDataUrl((dataUrl) => {
      $timeout(()=>{ ctrl.selectedIndex = undefined }, 1000);
    });
  }

  self.isMobile = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  return self;

}]);