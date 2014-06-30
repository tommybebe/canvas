'use strict';

angular.module('canvasApp')
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', 'auth', 'db', function ($rootScope, $scope, $location, auth, db) {
    $rootScope.auth = $rootScope.auth || auth;

    $scope.create = function(){
      var _db = db.initialize('canvas'),
        newTitle = new Date(),
        canvas = {
          title: newTitle,
          createAt: new Date(),
          author: {}
        };
      canvas.author[$scope.user.uid] = {
        name: $scope.user.name,
        picture: $scope.user.picture,
        email: $scope.user.email
      };
      _db.$add(canvas).then(function(ref){
        var addedCanvasId = ref.name();
        $scope.user.$child('canvas').$child(addedCanvasId).$update({
          title: newTitle,

        }).then(function(){
          $location.url('/canvas/'+addedCanvasId);
        });
      });
    };
  }]);