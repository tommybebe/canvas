'use strict';

angular.module('canvasApp')
  .controller('NavbarCtrl', ['$scope', '$location', '$timeout', 'auth', function ($scope, $location, $timeout, auth) {

    $scope.auth = auth;
    $scope.menu = [
      { 'title': 'Home', 'link': '/' },
      { 'title': 'dashboard', 'link': '/dashboard' }
    ];
    $scope.dashboard = $location.path()==='/dashboard'?true:false;

    // $scope.$on('authEvent:login', function(){
    //   $scope.message = db.initialize('message').$child(auth.user.escapedEmail);
    // });

    $scope.logout = function(){
      auth.logout();
      window.location='/';
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.check = _.debounce(function(id){
      auth.message.del(id);
    }, 1000);
  }]);
