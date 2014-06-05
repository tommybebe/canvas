'use strict';
angular.module('canvasApp')
  .factory('fire', ['$firebase', 'FIREBASE_URI', function($firebase, FIREBASE_URI){
    var ref = new Firebase(FIREBASE_URI + '/canvas'),
      items = $firebase(ref);

    var create = function(item){
      items.$add(item);
    },
    read = function(){
      return items;
    },
    update = function(id){
      items.$save(id);
    },
    del = function(id){
      items.$remove(id);
    };

    return {
      create: create,
      read: read,
      update: update,
      del: del
    };
  }]);

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', 'fire', function ($scope, $routeParams, fire) {
    // $http.get('/api/canvas/'+$routeParams.id).success(function(canvas) {
    //   $scope.canvas = canvas;
    // });
    $scope.newItem = { title: 'Empty title', dummy: 2000 };
    $scope.CurrentItem = null;
    $scope.items = fire.read();

    $scope.create = function(){
      fire.create(angular.copy($scope.newItem));
      $scope.newItem = { title: 'Empty title', dummy: 2000 };
    };
    $scope.update = function(id){
      fire.update(id);
    };
    $scope.del = function(id){
      fire.del(id);
    };
    $scope.test = function(){
      console.log($scope.items);
    };

  }]);

