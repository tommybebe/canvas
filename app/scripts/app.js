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
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/canvas/:id', {
        templateUrl: 'partials/canvas.html',
        controller: 'CanvasCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $location, $templateCache, $experiment){
    $experiment($location.path(), $templateCache);
    $rootScope.$on('$routeChangeSuccess', function(){
      ga('send', 'pageview', $location.path());
    });
  });