'use strict';
angular.module('canvasApp')
  .controller('DashboardCtrl', ['$scope', 'canvasHandler', function ($scope, canvasHandler){
    $scope.create = canvasHandler.create;
  }]);