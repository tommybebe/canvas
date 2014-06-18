'use strict';

angular.module('canvasApp')
  .controller('NavbarCtrl', ['$scope', '$location', 'auth', function ($scope, $location, auth) {

    $scope.auth = auth;

    $scope.menu = [
      { 'title': 'Home', 'link': '/' },
      { 'title': 'dashboard', 'link': '/dashboard' },
      { 'title': 'canvas', 'link': '/canvas/-JObyI94_HAnQcyYnIBT' }
    ];

    $scope.logout = function(){
      auth.logout();
      window.location='/';
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
