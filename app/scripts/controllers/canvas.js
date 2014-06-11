'use strict';
angular.module('canvasApp')
  .filter('canvasSort', function(){
    return function(input){
      return input;
    };
  });

angular.module('canvasApp')
  .directive('canvasSideBar', function(){
    return {
      scope: true,
      restrict: 'E',
      templateUrl: 'partials/canvas-side-bar.html'
    };
  });

angular.module('canvasApp')
  .directive('canvasItems', function(){
    return {
      scope: true,
      restrict: 'E',
      templateUrl: 'partials/canvas-item.html',
      link: function($scope, $element, $attr){
        $scope.itemArea = $attr.area;
        $scope.placeholder = $attr.placeholder;
        $scope.newItem = {};

        $scope.items = $scope.area.$child($scope.itemArea);

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
          $scope.items.$save(id);
        };
        $scope.add = function(area){
          var item = _.assign(angular.copy($scope.newItem), {
            area: area,
            createAt: new Date(),
            updateAt: new Date()
          });
          if(!item || !item.content || item.content === ''){ return; }
          $scope.items.$add(item);
          $scope.newItem = {};
        };
        $scope.del = function(id){
          $scope.items.$remove(id);
        };
      }
    };
  });

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', 'db', function ($scope, $routeParams, db) {
    var _db = db.initialize('canvas');
    $scope.canvas = _db.$child($routeParams.id);
    $scope.area = $scope.canvas.$child('area');
    $scope.save = function(attr){
      $scope.canvas.$child(attr).$set($scope.canvas.title);
    };
  }]);
