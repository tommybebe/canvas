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

        $rootScope.user = _db.$child(escapedEmail);
        $rootScope.user.$update(user);
          // .then(function(){
          //   var index = db.initialize('userIndex');
          //   index.$child(escapedEmail).$set(user.uid);
          // });
      } else {
        // user is logged out
      }
    });

    function escapeEmail(email){
      return (email || '').replace('.', ',');
    }

    // function unescapeEmail(email){
    //   return (email || '').replace(',', '.');
    // }

    return auth;
  }]);
