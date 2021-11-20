const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts_times");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

angular.module('psmsApp').
  factory('printContract', 
  [
    '$timeout',
    '$q',
    '$filter',
  function (
    $timeout,
    $q,
    $filter) {
  
  var self = this;

  self.print = function(scholarDetails, ctrl, governor){

    let pdfDocGenerator = self.contract(scholarDetails, governor);

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

  self.contract = function(scholarDetails, gov){
      let governor = $filter('formatGovernor')(JSON.parse(gov));

      let fonts = {
        TimesNewRoman: {
            normal: 'Times-Regular.ttf',
            bold: 'Times-Bold.ttf',
            italics: 'Times-Italic.ttf',
            bolditalics: 'Times-BoldItalic.ttf'
        }
      };

      let docDefinition = {
        content: [
          '\n',
          {
            text: 'Republic of the Philippines',
            alignment: 'center'
          },
          {
            text: 'Province of Antique',
            alignment: 'center'
          },
          {
            text: 'PROVINCIAL GOVERNMENT EDUCATIONAL ASSISTANCE PROGRAM',
            alignment: 'center',
            bold: true
          },
          '\n',
          {
            alignment: 'left',
            columns: [
              {
                text: [
                    { text:'Name of Student: '+ $filter('concatName')(scholarDetails) +'\n'},
                    { text:'Residence Address: '+ $filter('formatAddress')(scholarDetails.address) },
                ],
                width: '65%',
              },
              {
                  text: [
                      { text:'Date of Birth: '+scholarDetails.date_of_birth+' \n' },
                      { text:'Civil Status: '+scholarDetails.civil_status }
                  ],
              }
            ],
            columnGap: 30
          },
          {
            text: 'Name of Parents:',
          },
          {
            alignment: 'left',
            columns: [
              { text:'Father: \n', margin: [39, 0], width: '40%'},
              { text:': ', width: 6},
              { text: $filter('fatherDetails')(scholarDetails.father_details), width:'50%' }
            ],
          },
          {
            alignment: 'left',
            columns: [
              { text:'Mother: \n', margin: [39, 0], width: '40%' },
              { text:': ', width: 6},
              { text: $filter('motherDetails')(scholarDetails.mother_details)+' \n', width:'50%' }
            ],
          },
          {
            alignment: 'left',
            columns: [
              { text:'Name of School where Enrolled: \n', width: '40%' },
              { text:': '+scholarDetails.school.school_name+' \n' }
            ]
          },
          {
            alignment: 'left',
            columns: [
              { text:'Course and Year Level: \n', width: '40%'},
              { text:': '+scholarDetails.course.course, margin: [0, 0, 20, 0]}
            ]
          },
          {
            alignment: 'left',
            columns: [
              { text:'Applicable SY and Semester: \n', width: '40%'},
              { text:': '+scholarDetails.academicyear_semester_contract.academic_year+' '+scholarDetails.academicyear_semester_contract.semester, margin: [0, 0, 20, 0]}
            ]
          },
          {
            alignment: 'justify',
            columns: [
              { text:'Amount of Educational Assistance for on (1) Semester', width: '59%' },
              { text:': Php '+$filter('currency')($filter('displayAmount')(scholarDetails.degree, scholarDetails.academicyear_semester_contract), '', 2)}
            ]
          },
          {
            text: 'Components of Assistance:',
          },
          {
            alignment: 'justify',
            columns: [
              { text:'1.', width: 'auto', margin: [33, 0, 0, 0]},
              {margin: [13, 0, 0, 0], text:'For payment of School Fees / other school related expenses; and'}
            ]
          },
          {
            alignment: 'justify',
            columns: [
              { text:'2.', width: 'auto', margin: [33, 0, 0, 0]},
              {margin: [13, 0, 0, 0], text:'For Stipend (Daily Allowance).'}
            ]
          },
          '\n\n',
          {
            text: 'DUTIES AND RESPONSIBILITIES OF THE STUDENT: \n\n\n',
          },
          {
            alignment: 'justify',
            columns: [
              { text:'1.', width: 'auto', margin: [33, 0, 0, 0]},
              { 
                text:'Shall be a duly enrolled student of the school, in the course and for the school year and semester indicated above',
                margin: [13, 0, 0, 0]
              }
            ]
          },
          {
            alignment: 'justify',
            columns: [
              { text:'2.', width: 'auto', margin: [33, 0, 0, 0]},
              {margin: [13, 0, 0, 0], text:'Shall sbmit to the office of the Governor - Administrative Division the Certificate of Registration Form or Registration (RF) or Email Confirmation from the school, valid School Identification Card or NSO/PSA Birth Certificate.'},
            ]
          },
          '\n',
          {
            text: 'DUTIES AND RESPONSIBILITIES OF THE PROVINCE: \n\n',
          },
          {
            alignment: 'justify',
            columns: [
              { text:'1.', width: 'auto', margin: [35, 0, 0, 0]},
              {margin: [13, 0, 0, 0], text:'Shall release the amout of Php '+ $filter('currency')($filter('displayAmount')(scholarDetails.degree, scholarDetails.academicyear_semester_contract), '', 2) +' to the student as a grant for the applicable semester;'},
            ]
          },
          {
            alignment: 'justify',
            columns: [
              { text:'2.', width: 'auto', margin: [35, 0, 0, 0]},
              { text:'Shall terminate the student\'s educational assistance who cannot maintain their duties and responsibilities as stipulated.', margin: [13, 0, 0, 0] },
            ]
          },
          '\n\n',
          {
            text: 'Signed this ______ of ___________________________, _______',
            margin: [35, 0, 0, 0]
          },
          '\n\n\n\n',
          {
            columns: [
              {
                text: [
                    { text: $filter('concatName')(scholarDetails) +'\n'},
                    { text:'Student', bold: true },
                ]
              },
              {
                  text: [
                      { text: governor +' \n' },
                      { text:'Governor', bold: true  }
                  ]
              }
            ],
            alignment: 'center',
          },
          '\n\n',
          {
            stack: [
              {
                text: [
                  {text: 'SUBSCRIBED AND SWORN TO '},
                  {text: 'before me, this ______ day of __________________, ______ by '+ $filter('concatName')(scholarDetails) +' and '+ governor +' who exhibited to me their STUDENT I.D NO. '+ scholarDetails.student_id_number +' and Tax Identification No. 117-574-963 issued on Nov. 5, 1999 at San Jose de Buenavista, Province of Antique, Philippines respectively.'},
                ]
              }
            ]
          },
          '\n\n',
          {
            text: 'Doc. No. : _________ ;',
          },
          {
            text: 'Page No. : _________ ;',
          },
          {
            text: 'Book No.: _________ ;',
          },
          {
            text: 'Series of  __________ ;',
          },
        ],
        defaultStyle: {
          font: 'TimesNewRoman',
          fontSize: 12,
        },
        pageSize: 'FOLIO',
      };

      return pdfMake.createPdf(docDefinition, null, fonts, pdfMake.vfs);;
  }

  return self;

}]);
