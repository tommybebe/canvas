'use strict';
angular.module('canvasApp')
  .factory('auth', ['$rootScope', 'db', function($rootScope, db){
    var auth = new FirebaseSimpleLogin(db.getRef(), function(error, current) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (current) {
        var _db = db.initialize('users');

        $rootScope.user = _db.$child(current.uid);
        $rootScope.user.$update({
          uid: current.uid,
          data: _.assign(current.thirdPartyUserData, {
            picture: 'http://graph.facebook.com/'+current.id+'/picture?type=square'
          }),
          lastLoginAt: new Date()
        });
      } else {
        // user is logged out
      }
    });
    return auth;
  }]);
