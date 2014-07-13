'use strict';
function escapeEmail(email){
  if(!email){ return; }
  return (email || '').replace(/\./g, ',');
}
function getNow(){
  try {
    return new Date().toISOString().slice(0, 10);
  } catch(e){
    return new Date();
  }
}

angular.module('canvasApp')
  .directive('canvasSideBar', ['db', 'auth', function(db, auth){

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
              uid: invitedUser.uid,
              email: invitedUser.email,
              name: invitedUser.name,
              picture: invitedUser.picture
            })
            .then(function(){
              $scope.searchResult = '';
              $scope.newAuthor = '';
              // invite message to user
              return auth.message.send('invited', $scope.canvas, invitedUser);
            })
            .then(function(){
              ga('send', 'event', 'Canvas', 'Author Invited');
            });
        };
        $scope.delAuthor = function(targetUser){
          if(!targetUser || !targetUser.uid){ return; }
          $scope.canvas.$child('author')
            .$remove(targetUser.uid)
            .then(function(){
              return auth.message.send('has removed your authority', $scope.canvas, escapeEmail(targetUser.email));
            })
            .then(function(){
              ga('send', 'event', 'Canvas', 'Author Removed');
            });
        };
      }
    };
  }]);

angular.module('canvasApp')
  .directive('canvasItems', [function(){
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
              updatedAt: getNow()
            })
            .then(function(){
              ga('send', 'event', 'Canvas', 'Item updated');
            });
          // $scope.items.$save(id);
        };
        $scope.add = function(area){
          var item = _.assign(angular.copy($scope.newItem), {
            area: area,
            createAt: getNow()
          });
          if(!item || !item.content || item.content === ''){ return; }
          item.$priority = $scope.items.$getIndex().length;
          $scope.items.$add(item)
            .then(function(){
              ga('send', 'event', 'Canvas', 'Item Added');
            });
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
  }]);

angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$routeParams', '$location', '$route', 'db', 'canvasHandler', function ($scope, $routeParams, $location, $route, db, canvasHandler) {
    //
    var canvas = canvasHandler.initialize($routeParams.id);
    //
    $scope.canvas = canvas.read();
    $scope.create = canvas.create;
    $scope.save = canvas.save;
    $scope.del = canvas.del;
    $scope.area = $scope.canvas.$child('area');
    $scope.loaded = false;
    $scope.canvas.$on('loaded', function(){
      canvasHandler.updatePath();
      $scope.loaded = true;
    });
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
            return auth.message.send('deleted', canvas, escapeEmail(authors[author].email));
          }
        });
      return $q.all(promises);
    },
    _updatePath = function(){
      var path = $location.path().split('/'),
        newPath = path[0]+'/'+path[1]+'/'+path[2]+'/'+canvas.title.replace(/[~!#$^&*=+|:;?"<,.>'%\s]/g, '-');
      if($location.path()===newPath){ return; }
      $location.path(newPath, false);
    };

    this.updatePath = _updatePath;
    this.initialize = function(id){
      canvas = _db.$child(id);
      return this;
    };
    this.create = function(){
      auth.getCurrentUser()
        .then(function(user){
          var now = getNow(),
            canvas = {
              title: 'Untitled Canvas / '+now,
              createAt: getNow(),
              author: {}
            };
          canvas.author[user.uid] = {
            uid: user.uid,
            name: user.name,
            picture: user.picture,
            email: user.email
          };
          return _db.$add(canvas).then(function(ref){
            var addedCanvasId = ref.name();
            user.$child('canvas').$child(addedCanvasId).$update({
              title: now
            }).then(function(){
              $location.url('/canvas/'+addedCanvasId);
            });
          });
        }).
        then(function(){
          ga('send', 'event', 'Canvas', 'Created');
        });
    };
    this.del = function(){
      auth.getCurrentUser()
        .then(function(user){
          return authorsCanvasRemove(canvas.author, canvas, user);
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
      _updatePath();
      canvas.$child(attr).$set(val);
      // update users data, with only title attr
      if(attr==='title'){
        auth.canvas
          .update(canvas.$id, {
            title: val
          })
          .then(function(){
            angular.forEach(canvas.author, function(user){
              auth.message.send('updated', canvas, escapeEmail(user.email));
            });
          });
      }
      legacy = canvas.title;
    };
    this.read = function(){
      return canvas;
    };
  }]);