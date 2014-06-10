'use strict';

angular.module('canvasApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      { 'title': 'Home', 'link': '/' },
      { 'title': 'dashboard', 'link': '/dashboard' },
      { 'title': 'canvas', 'link': '/canvas/-JObyI94_HAnQcyYnIBT' }
    ];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
