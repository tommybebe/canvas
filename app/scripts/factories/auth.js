'use strict';
angular.module('canvasApp')
  .factory('auth', ['$rootScope', 'db', function($rootScope, db){
    var auth = new FirebaseSimpleLogin(db.getRef(), function(error, current) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (current) {
        var _db = db.initialize('users'),
          escapedEmail = escapeEmail(current.thirdPartyUserData.email),
          user = _.assign(current.thirdPartyUserData, {
            uid: current.uid,
            escapedEmail: escapedEmail,
            picture: 'http://graph.facebook.com/'+current.id+'/picture?type=square',
            lastLoginAt: new Date()
          });

        auth.user = user;
        $rootScope.user = _db.$child(escapedEmail);
        $rootScope.user.$update(user);
          // .then(function(){
          //   var index = db.initialize('userIndex');
          //   index.$child(escapedEmail).$set(user.uid);
          // });

        var messageRef = db.getRef('message/'+user.escapedEmail);
        messageRef.on('value', function(data){
          // check & update
          var message = data.val() || {},
            array = _.values(message),
            invited = array.filter(function(val){ return val.type==='invite'; }),
            deleted = array.filter(function(val){ return val.type==='delete'; }),
            updated = array.filter(function(val){ return val.type==='update'; });

          if((invited.length+updated.length+deleted.length)>0){
            angular.forEach(invited, function(val){
              $rootScope.user.canvas[val.target.id] = {
                title: val.target.title
              };
            });
            angular.forEach(updated, function(val){
              $rootScope.user.canvas[val.target.id] = {
                title: val.target.title
              };
            });
            angular.forEach(deleted, function(val){
              delete $rootScope.user.canvas[val.target.id];
            });
            $rootScope.user.$save();

          }

          // apply
          $rootScope.$apply(function(){
            $rootScope.message = message;
            $rootScope.message.$getIndex = function(){
              return Object.keys($rootScope.message).filter(function(val){
                return val.charAt(0) !== '$';
              });
            };
            $rootScope.message.$remove = function(id){
              return messageRef.child(id).remove();
            };
          });
        });
      } else {
        // user is logged out
      }
    });

    auth.message = {
      del: function(id){
        $rootScope.message.$remove(id);
      },
      send: function(type, target, to){
        if(angular.isObject(to) && to.$id){ to = angular.copy(to).$id; }
        if(to === $rootScope.user.$id){ return; }
        return db.initialize('message').$child(to).$add({
          createAt: new Date(),
          type: type,
          target: {
            id: target.$id,
            title: target.title
          },
          from: {
            name: $rootScope.user.name,
            uid: $rootScope.user.uid,
            email: $rootScope.user.email,
            picture: $rootScope.user.picture
          }
        });
      }
    };
    auth.canvas = {
      update: function(id, val){
        return $rootScope.user.$child('canvas').$child(id).$set(val);
      }
    };
    function escapeEmail(email){
      return (email || '').replace('.', ',');
    }
    // function unescapeEmail(email){
    //   return (email || '').replace(',', '.');
    // }

    return auth;
  }]);
