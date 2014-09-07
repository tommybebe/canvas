'use strict';
angular.module('canvasApp')
  .directive('rating', ['$timeout', 'auth',  function($timeout, auth){
    return {
      require: 'ngModel',
      restrict: 'EA',
      scope: {
        model: '=ngModel',
        user: '='
      },
      templateUrl: 'partials/rating.html',
      link: function($scope){
        var placeholders = [
          'ex) Don\'t do it.',
          'ex) What a bad idea.',
          'ex) Not bad.',
          'ex) Good.',
          'ex) Ok. Let\'s to this.'
        ];
        $scope.auth = auth;
        $scope.placeholder = 'Leave a comment.';
        $scope.submitButtonText = 'Submit';
        $scope.$watch('model', function(){
          $scope.rating = $scope.model;
          $scope.setStars = function(index, user){
            $scope.placeholder = placeholders[index-1];
            $scope.submitButtonText = 'Saving..';
            $scope.model.$child(user.id).$set({
              stars: index,
              user: {
                name: user.name,
                email: user.email,
                picture: user.picture
              }
            }).then(function(){
              $scope.submitButtonText = 'Saved!';
              $timeout(function(){
                $scope.submitButtonText = 'Submit';
              }, 1000);
            });
          };
        });

        $scope.comment = function(user, $event){
          $scope.submitButtonText = 'Saving..';
          var comment = $event.target.value || $event.target.elements[0].value;
          $scope.model.$child(user.id).$child('comment').$set(comment)
          .then(function(){
            $scope.submitButtonText = 'Saved!';
            $timeout(function(){
              $scope.submitButtonText = 'Submit';
            }, 1000);
          });
        };

      }
    };
  }])

  .directive('stars', [function(){
    return {
      restrict: 'EA',
      scope: {
        rate: '&',
        model: '=ngModel'
      },
      templateUrl: 'partials/stars.html',
      link: function($scope, $element, $attr){
        $element.addClass('stars');
        $scope.$watch('model', function(){
          $scope.paint($scope.model);
        });
        $scope.paint = function(index){
          var icons = $element.children().children().children();
          angular.forEach(icons, function(dom, i){
            dom.className = i<index? 'icon-star' : 'icon-star-o';
          });
        };
        $scope.reset = function(){
          $scope.paint($scope.model);
        };
        if($attr.disabled !== ''){
          $scope.hover = $scope.paint;
          $scope.carve = function(index){
            $element.addClass('rated');
            $scope.paint(index);
            $scope.rate({
              index: index
            });
          };
        } else {
          $element.addClass('disabled');
        }
      }
    };
  }]);
