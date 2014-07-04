'use strict';
angular.module('canvasApp')
  .directive('notFound', ['TEMPLATE', function(TEMPLATE){

    return {
      scope: true,
      restrict: 'A',
      templateUrl: TEMPLATE.notFound,
      link: function($scope){
        $scope.search = function(){
         
        };
      }
    };
  }]);