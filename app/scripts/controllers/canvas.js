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
  .directive('canvasItem', function(){
    return {
      scope: true,
      restrict: 'E',
      templateUrl: 'partials/canvas-item.html',
      link: function($scope, $element, $attr){
        $scope.itemArea = $attr.area;
        $scope.newItem = {};
        $scope.toggle = function(obj, $event){
          var clickedDom = angular.element($event.target),
            hidedDom,
            focusOut;
          if(clickedDom[0].tagName.toLowerCase() === 'p'){
            hidedDom = clickedDom.next();
            focusOut = true;
          } else {
            hidedDom = clickedDom.prev();
          }
          clickedDom.hide();
          hidedDom.show();
          if(focusOut){
            hidedDom.focus();
          }
        };
        $scope.save = function(id, $event){
          $scope.toggle(id, $event);
          $scope.update(id)
        }
        $scope.add = function(area){
          var item = _.assign(angular.copy($scope.newItem), {
            area: area,
            createAt: new Date(),
            updateAt: new Date()
          });
          $scope.create(item);
          $scope.newItem = {};
        }
      }
    }
  });

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', 'fire', function ($scope, $routeParams, fire) {
    $scope.items = fire.initialize($routeParams.id);
    $scope.create = function(item){
      fire.create(item);
    };
    $scope.update = function(id, $event){
      fire.update(id);
    };
    $scope.del = function(id){
      fire.del(id);
    };
    $scope.test = function(){
      console.log($scope.items);
    };
  }]);

