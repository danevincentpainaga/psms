import '../sass/style.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

// import 'jquery/dist/jquery.min.js';
import angular from 'angular';
import '@uirouter/angularjs/release/angular-ui-router.min.js';
import '@uirouter/angularjs/lib/legacy/stateEvents.js';
import 'angular-cookies/angular-cookies.min.js';
import 'angular-sanitize/angular-sanitize.min.js';
import 'angular-touch/angular-touch.min.js';
import 'angular-resource/angular-resource.min.js';
import 'angular-resource/angular-resource.min.js';
import 'angular-material-data-table/dist/md-data-table.min.js';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;