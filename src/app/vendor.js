import '../sass/style.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import angular from 'angular';
import 'chart.js/dist/chart';
import 'angular-chart.js/dist/angular-chart';
import '@uirouter/angularjs/release/angular-ui-router.min.js';
import '@uirouter/angularjs/lib/legacy/stateEvents.js';
import 'angular-cookies/angular-cookies.min.js';
import 'angular-sanitize/angular-sanitize.min.js';
import 'angular-touch/angular-touch.min.js';
import 'angular-resource/angular-resource.min.js';
import 'angular-resource/angular-resource.min.js';
import 'angular-ui-grid/ui-grid.min.js';
import 'angular-ui-grid/ui-grid.core.min.js';
import 'angular-ui-grid/ui-grid.exporter.min.js';
import 'angular-ui-grid/ui-grid.importer.min.js';
import 'angular-ui-grid/ui-grid.selection.min.js';
import 'angular-ui-grid/ui-grid.resize-columns.min.js';
import 'angular-ui-grid/ui-grid.move-columns.min.js';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;