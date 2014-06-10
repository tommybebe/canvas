'use strict';
angular.module('canvasApp')
  .service('db', ['$firebase', 'FIREBASE_URI', function($firebase, FIREBASE_URI){
    var ref = new Firebase(FIREBASE_URI);
    this.initialize = function(resource){
      return $firebase(ref).$child(resource);
    };
    this.getRef = function(){
      return ref;
    };
  }]);
