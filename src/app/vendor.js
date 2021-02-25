import '../sass/style.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

// import angular from 'angular';
import 'chart.js/dist/chart';
import 'angular-chart.js/dist/angular-chart';
import '@uirouter/angularjs/release/angular-ui-router.min';
import '@uirouter/angularjs/lib/legacy/stateEvents';
import 'angular-cookies/angular-cookies.min';
import 'angular-sanitize/angular-sanitize.min';
import 'angular-touch/angular-touch.min';
import 'angular-resource/angular-resource.min';
// import 'angular-resource/angular-resource.min';
// import 'angular-ui-grid/ui-grid.min';
import 'angular-ui-grid/ui-grid.core.min';
import 'angular-ui-grid/ui-grid.exporter.min';
import 'angular-ui-grid/ui-grid.importer.min';
import 'angular-ui-grid/ui-grid.selection.min';
import 'angular-ui-grid/ui-grid.resize-columns.min';
import 'angular-ui-grid/ui-grid.move-columns.min';
import 'angular-ui-grid/ui-grid.auto-resize.min';
import 'angular-ui-grid/ui-grid.pinning.min';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;