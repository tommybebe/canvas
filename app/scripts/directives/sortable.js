'use strict';
angular.module('ui.sortable', [])
  .value('uiSortableConfig',{})
  .directive('uiSortable', ['uiSortableConfig', '$timeout', function(uiSortableConfig, $timeout) {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel){
          if (ngModel) {

            // When we add or remove elements, we need the sortable to 'refresh'
            // so it can find the new/removed elements.
            scope.$watch(attrs.ngModel+'.$getIndex().length', function() {
              // Timeout to let ng-repeat modify the DOM
              $timeout(function() {
                // ensure that the jquery-ui-sortable widget instance
                // is still bound to the directive's element
                if (!!element.data('ui-sortable')) {
                  element.sortable('refresh');
                }
              });
            });
          }
          element.sortable({
            start: function(e, ui){
              ui.item.sortable = {
                index: ui.item.index()
              };
            },
            stop: function(e, ui){
              var model = ngModel.$modelValue,
                started = ui.item.sortable.index,
                ended = ui.item.index(),
                before = _.findKey(model, { $priority: started }),
                after = _.findKey(model, { $priority: ended });
              model[before].$priority = ended;
              model[after].$priority = started;
              model.$save();
            },
            update: function(){
              
            }
          });
        }
      };
    }
  ]);
