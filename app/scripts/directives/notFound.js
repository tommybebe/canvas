'use strict';
angular.module('canvasApp')
  .directive('notFound', [function(){
    return {
      restrict: 'A',
      templateUrl: 'partials/notFound/404.html',
      link: function(){
      }
    };
  }]);