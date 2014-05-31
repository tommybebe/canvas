'use strict';
angular.module('canvasApp')
  .factory('fac', function(){
    return {
      name: 'fac'
    };
  });
angular.module('canvasApp')
  .controller('CanvasCtrl', ['$scope', '$http', '$routeParams', 'fac', function ($scope, $http, $routeParams, fac) {
    $http.get('/api/canvas/'+$routeParams.id).success(function(canvas) {
      $scope.canvas = canvas;
    });
  }]);
