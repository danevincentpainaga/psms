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
require('../directives/editScholarDirective');
require('../directives/passwordConfirmDirective');

require('../filters/filters');

require('../factories/alertDialog');
require('../factories/addScholarsService');
require('../factories/debounce');
require('../factories/momentService');
require('../factories/exportService');
require('../factories/validateContractStatusService');
require('../factories/printContractService');

require('../apiServices/municipalitiesApiService');
require('../apiServices/authApiService');
require('../apiServices/schoolApiService');
require('../apiServices/addressApiService');
require('../apiServices/scholarApiService');
require('../apiServices/academicContractService');
require('../apiServices/usersApiService');
require('../apiServices/academicSemesterYearApiService');
require('../apiServices/dashboardApiService');
require('../apiServices/courseApiService');
require('../apiServices/importScholarApiService');
require('../apiServices/exportScholarsApiService');

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