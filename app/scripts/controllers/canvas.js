'use strict';
angular.module('canvasApp')
  .factory('fire', ['$firebase', 'FIREBASE_URI', '$location', function($firebase, FIREBASE_URI, $location){
    var ref = new Firebase(FIREBASE_URI + '/canvas'),
      conn = $firebase(ref),
      items = {};

    var initialize = function(id){
      items = conn.$child(id);
      return items;
    },
    create = function(item){
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
      initialize: initialize,
      create: create,
      read: read,
      update: update,
      del: del
    };
  }]);

angular.module('canvasApp')
  .filter('canvasSort', function(){
    return function(input, area){
      var filterd = {};
      if(!input) return;
      Object.keys(input).forEach(function(key, i){
        var item = input[key];
        if(item.area == area){
          filterd[key] = item;
        }
      });
      return filterd;
    };
  });

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', 'fire', function ($scope, $routeParams, fire) {
    // $http.get('/api/canvas/'+$routeParams.id).success(function(canvas) {
    //   $scope.canvas = canvas;
    // });
    $scope.newItem = { title: 'Empty title', dummy: 2000 };
    $scope.CurrentItem = null;
    $scope.canvas = fire.initialize($routeParams.id);
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

