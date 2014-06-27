'use strict';
angular.module('canvasApp')
  .directive('canvasSideBar', ['db', function(db){
    function escapeEmail(email){
      return (email || '').replace('.', ',');
    }

    return {
      scope: true,
      restrict: 'A',
      templateUrl: 'partials/canvas-side-bar.html',
      link: function($scope){
        var _db = db.initialize('users');
        $scope.search = function(){
          var input = escapeEmail($scope.newAuthor);
          $scope.searchResult = _db.$child(input);
          if($scope.searchResult.$getIndex().length === 0){
            $scope.searchResult = {
              name: 'No result with ' + $scope.newAuthor
            };
          }
        };
        $scope.addAuthor = function(user){
          $scope.canvas.$child('author').$child(user.uid)
            .$set({
              email: user.email,
              name: user.name,
              picture: user.picture
            })
            .then(function(){
              $scope.searchResult = '';
            });
        };
      }
    };
  }]);

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
            setTimeout(function(){
              hidedDom.focus();
            }, 100);
          }
        };
        $scope.save = function(id, $event){
          // $scope.toggle(id, $event);
          var input = $event.target.value || $event.target.elements[0].value;
          if(!input){ return; }
          $scope.items.$child(id)
            .$update({
              content: input,
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
          item.$priority = $scope.items.$getIndex().length;
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
  }]);

angular.module('canvasApp')
  .service('canvasHandler', ['$q', '$location', 'db', function($q, $location, db){
    var _db = db.initialize('canvas'),
      canvas;

    var authorsCanvasRemove = function(authors, canvasId, user){
      var message = db.initialize('message'),
        now = new Date(),
        promises = Object.keys(authors).map(function(author){
          if(author === user.uid){
            return user.$child('canvas').$remove(canvasId);
          } else {
            return message.$child(author).$add({
                createAt: now,
                type: 'delete',
                content: canvasId,
                from: {
                  name: user.name,
                  uid: user.uid,
                  email: user.email
                }
              });
          }
        });
      return $q.all(promises);
    };

    this.initialize = function(id){
      canvas = _db.$child(id);
      return this;
    };
    this.del = function(user){
      authorsCanvasRemove(canvas.author, canvas.$id, user)
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