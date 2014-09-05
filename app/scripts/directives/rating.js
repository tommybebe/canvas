'use strict';
angular.module('canvasApp')
  .directive('rating', [function(){
    return {
      restrict: 'EA',
      templateUrl: 'partials/rating.html',
      link: function($scope, $element, $attr){
      	$scope.rate = function(){
      		var stars = $element.children().children('ul.stars').children();
      		console.log(stars);
      	};
      }
    };
  }]);