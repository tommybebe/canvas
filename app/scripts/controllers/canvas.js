'use strict';
angular.module('canvasApp')
  .directive('canvasSideBar', ['db', 'auth', function(db, auth){
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
              noResult: 'No result with ' + $scope.newAuthor
            };
          }
        };
        $scope.addAuthor = function(invitedUser){
          if(!invitedUser || !invitedUser.name || !invitedUser.picture){
            $scope.searchResult = '';
            $scope.newAuthor = '';
            return;
          }
          $scope.canvas.$child('author').$child(invitedUser.uid)
            .$set({
              email: invitedUser.email,
              name: invitedUser.name,
              picture: invitedUser.picture
            })
            .then(function(){
              $scope.searchResult = '';
              $scope.newAuthor = '';
              // invite message to user
              auth.message.send('invite', $scope.canvas, invitedUser);
            });
        };
        $scope.delAuthor = function(targetUser){
          var targetUserId = targetUser.email.replace('.', ',');
          $scope.canvas.$child('author').$remove(targetUserId);
          auth.message.send('authority remove', $scope.canvas, targetUserId);
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
          var array = [],
            index = $scope.items[id].$priority;
          $scope.items.$getIndex().forEach(function(key){
            array.push($scope.items[key]);
          });
          for(var i=index; i<$scope.items.$getIndex().length; i++){
            array[i].$priority--;
          }
          delete $scope.items[id]; // $scope.items.$remove(id)
          $scope.items.$save();
          
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
    $scope.create = canvas.create;
    $scope.save = canvas.save;
    $scope.del = canvas.del;
    $scope.area = $scope.canvas.$child('area');

  }]);

angular.module('canvasApp')
  .service('canvasHandler', ['$q', '$location', 'db', 'auth', function($q, $location, db, auth){
    var _db = db.initialize('canvas'),
      canvas, legacy;

    var authorsCanvasRemove = function(authors, canvas, user){
      var promises = Object.keys(authors).map(function(author){
          if(author === user.uid){
            return user.$child('canvas').$remove(canvas.$id);
          } else {
            return auth.message.send('delete', canvas, authors[author].email.replace('.', ','));
          }
        });
      return $q.all(promises);
    };

    this.initialize = function(id){
      canvas = _db.$child(id);
      return this;
    };
    this.create = function(){
      auth.getCurrentUser()
        .then(function(user){
          var newTitle = new Date(),
            canvas = {
              title: newTitle,
              createAt: new Date(),
              author: {}
            };
          canvas.author[user.uid] = {
            name: user.name,
            picture: user.picture,
            email: user.email
          };
          _db.$add(canvas).then(function(ref){
            var addedCanvasId = ref.name();
            user.$child('canvas').$child(addedCanvasId).$update({
              title: newTitle
            }).then(function(){
              $location.url('/canvas/'+addedCanvasId);
            });
          });
        });
    };
    this.del = function(){
      auth.getCurrentUser()
        .then(function(user){
          return authorsCanvasRemove(canvas.author, canvas, user)
        })
        .then(function(){
          return canvas.$remove();
        })
        .then(function(){
          $location.url('/dashboard');
        });
    };
    this.save = function(attr, val){
      if(legacy === canvas.title){
        return;
      }
      canvas.$child(attr).$set(val);
      // update users data, with only title attr
      if(attr==='title'){
        auth.canvas
          .update(canvas.$id, {
            title: val
          })
          .then(function(){
            angular.forEach(canvas.author, function(user){
              auth.message.send('update', canvas, user.email.replace('.', ','));
            });
          });
      }
      legacy = canvas.title;
    };
    this.read = function(){
      return canvas;
    };
  }]);