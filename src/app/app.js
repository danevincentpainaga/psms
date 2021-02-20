require('../app/config');

require('angular-material');
require('angular-animate');
require('angular-aria');

require('../directives/fixedColumnTableDirective');
require('../directives/addSchoolDirective');
require('../directives/addDoubleSlashesDirective');
require('../directives/colorDegreeDirective');
require('../directives/colorScholarStatusDirective');
require('../directives/colorContractStatusDirective');
require('../directives/colorContractDirective');
require('../directives/filereadDirective');

require('../filters/filters');

require('../factories/addScholarsService');
require('../factories/debounce');
require('../factories/momentService');
require('../factories/exportScholarsService');

require('../services/municipalitiesApiService');
require('../services/alertDialog');
require('../services/authApiService');
require('../services/schoolApiService');
require('../services/addressApiService');
require('../services/scholarApiService');
require('../services/academicContractService');
require('../services/usersApiService');
require('../services/academicSemesterYearApiService');
require('../services/dashboardApiService');
require('../services/courseApiService');

require('../controllers/mainCtrl');
require('../controllers/dashboardCtrl');
require('../controllers/loginCtrl');
require('../controllers/addUndergraduateCtrl');
require('../controllers/addMastersDoctorateCtrl');
require('../controllers/scholarsListCtrl');
require('../controllers/schoolsCtrl');
require('../controllers/addSchoolCtrl');
require('../controllers/updateSchoolCtrl');
require('../controllers/userAccountsCtrl');
require('../controllers/contractCtrl');
require('../controllers/exportScholarsCtrl');
require('../controllers/importScholarsCtrl');
require('../controllers/editScholarCtrl');
require('../controllers/addressCtrl');
require('../controllers/courseCtrl');