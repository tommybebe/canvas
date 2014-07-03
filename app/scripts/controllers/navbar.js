'use strict';

angular.module('canvasApp')
  .controller('NavbarCtrl', ['$scope', '$location', '$timeout', 'auth', 'canvasHandler', function ($scope, $location, $timeout, auth, canvasHandler) {

    $scope.auth = auth;
    $scope.menu = [
      { 'title': 'Home', 'link': '/' },
      { 'title': 'dashboard', 'link': '/dashboard' }
    ];
    $scope.dashboard = $location.path()==='/dashboard'?true:false;

    // $scope.$on('authEvent:login', function(){
    //   $scope.message = db.initialize('message').$child(auth.user.escapedEmail);
    // });
    $scope.create = canvasHandler.create;
    $scope.logout = function(){
      auth.logout();
      window.location='/';
    };
    $scope.check = _.debounce(function(id){
      auth.message.del(id);
    }, 1000);
  }]);
