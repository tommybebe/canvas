'use strict';
angular.module('canvasApp')
  .directive('footer', [function(){
    return {
      restrict: 'A',
      templateUrl: 'partials/footer.html',
      link: function(){
      }
    };
  }]);