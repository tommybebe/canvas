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
          $scope.items.$child(id)
            .$update({
              content: $event.target.value,
              updatedAt: new Date()
            });
          // $scope.items.$save(id);
        };
        $scope.add = function(area){
          var item = _.assign(angular.copy($scope.newItem), {
            area: area,
            createAt: new Date()
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
  .controller('CanvasCtrl', ['$scope', '$routeParams', '$location', 'db', 'canvasHandler', function ($scope, $routeParams, $location, db, canvasHandler) {
    //
    var canvas = canvasHandler.initialize($routeParams.id);
    //
    $scope.canvas = canvas.read();
    $scope.save = canvas.save;
    $scope.del = canvas.del;
    
    $scope.area = $scope.canvas.$child('area');
    $scope.getUserPicture = function(uid){
      var user = uid.split(':'),
        provider = user[0],
        id = user[1],
        img = {
          facebook : function(id){
            return 'http://graph.facebook.com/'+id+'/picture?type=square';
          }
        };

      return img[provider](id);
    };
  }]);

angular.module('canvasApp')
  .service('canvasHandler', ['$q', '$location', 'db', function($q, $location, db){
    var _db = db.initialize('canvas'),
      canvas;

    var authorsCanvasRemove = function(authors, canvasId){
      var users = db.initialize('users'),
        promises = Object.keys(authors).map(function(author){
          var defer = $q.defer();
          users.$child(author).$child('canvas')
            .$remove(canvasId)
            .then(function(data){
              defer.resolve(data);
            })
            .then(null, function(err){
              defer.reject(err);
            });
        });
      return $q.all(promises);
    };

    this.initialize = function(id){
      canvas = _db.$child(id);
      return this;
    };
    this.del = function(){
      authorsCanvasRemove(canvas.author, canvas.$id)
        .then(function(){
          return canvas.$remove();
        })
        .then(function(){
          $location.url('/dashboard');
        });
    };
    this.save = function(attr, val){
      canvas.$child(attr).$set(val);
    };
    this.read = function(){
      return canvas;
    };
  }]);