'use strict';
angular.module('canvasApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.sortable',
  'yaru22.angular-timeago',
  'config'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'partials/dashboard',
        controller: 'DashboardCtrl'
      })
      .when('/canvas/:id', {
        templateUrl: 'partials/canvas',
        controller: 'CanvasCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });

