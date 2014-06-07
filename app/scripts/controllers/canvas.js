'use strict';
angular.module('canvasApp')
  .factory('fire', ['$firebase', 'FIREBASE_URI', function($firebase, FIREBASE_URI){
    var ref = new Firebase(FIREBASE_URI + '/canvas'),
      conn = $firebase(ref),
      canvas = {},
      items = {};

    var initialize = function(id){
      canvas = conn.$child(id);
      items = canvas.$child('items');
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
      if(!input) { return; }
      Object.keys(input).forEach(function(key){
        var item = input[key];
        if(item.area === area){
          filterd[key] = item;
        }
      });
      return filterd;
    };
  });

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', 'fire', function ($scope, $routeParams, fire) {
    $scope.newItem = { content: 'Empty content' };
    $scope.items = fire.initialize($routeParams.id);
    $scope.create = function(area){
      fire.create(_.assign(angular.copy($scope.newItem), {
        area: area,
        createAt: new Date(),
        updateAt: new Date()
      }));
      $scope.newItem = { content: 'Empty content' };
    };
    $scope.update = function(id, $event){
      fire.update(id);
      $scope.toggle(id, $event);
    };
    $scope.del = function(id){
      fire.del(id);
    };
    $scope.test = function(){
      console.log($scope.items);
    };
    $scope.toggle = function(obj, $event){
      var clickedDom = $($event.target),
        hidedDom;
      if(clickedDom[0].tagName.toLowerCase() === 'p'){
        hidedDom = clickedDom.next();
      } else {
        hidedDom = clickedDom.prev();
      }
      clickedDom.hide();
      hidedDom.show();
    };
  }]);

