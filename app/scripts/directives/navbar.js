'use strict';
angular.module('canvasApp')
  .directive('navbar', [function(){
    return {
      restrict: 'A',
      templateUrl: 'partials/navbar.html',
      link: function(){
      }
    };
  }]);