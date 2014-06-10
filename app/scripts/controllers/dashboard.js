'use strict';
angular.module('canvasApp')
  .controller('DashboardCtrl', ['$scope', '$routeParams', 'db', function ($scope, $routeParams, db) {
    var auth = new FirebaseSimpleLogin(db.getRef(), function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        $scope.user = user;
        // user authenticated with Firebase
        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
      } else {
        // user is logged out
        console.log(arguments);
      }
    });
    // auth.login('password', {
    //   email: 'hansupanda@gmail.com',
    //   password: '1111'
    // });
    auth.login('facebook');
  }]);