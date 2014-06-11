'use strict';
angular.module('canvasApp')
  .controller('DashboardCtrl', ['$scope', '$routeParams', 'db', function ($scope, $routeParams, db) {
    $scope.auth = new FirebaseSimpleLogin(db.getRef(), function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        var _db = db.initialize('users');

        $scope.user = _db.$child(user.uid);
        $scope.user.$update({
          uid: user.uid,
          data: user.thirdPartyUserData,
          lastLoginAt: new Date()
        });
      } else {
        // user is logged out
      }
    });
    $scope.create = function(){
      var _db = db.initialize('canvas'),
        newTitle = new Date(),
        canvas = {
          title: newTitle,
          createAt: new Date(),
          author: {}
        };
      canvas.author[$scope.user.uid] = {
        name : $scope.user.data.name
      };
      _db.$add(canvas).then(function(ref){
        var addedCanvasId = ref.name();
        $scope.user.$child('canvas').$child(addedCanvasId).$update({
          title: newTitle
        });
      });
    };
  }]);