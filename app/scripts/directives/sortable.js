'use strict';
angular.module('ui.sortable', [])
  .value('uiSortableConfig',{})
  .directive('uiSortable', ['uiSortableConfig', '$timeout', function(uiSortableConfig, $timeout) {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel){
          var savedNodes;

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
            activate: function(/*e, ui*/) {
              // We need to make a copy of the current element's contents so
              // we can restore it after sortable has messed it up.
              // This is inside activate (instead of start) in order to save
              // both lists when dragging between connected lists.
              savedNodes = element.contents();

              // If this list has a placeholder (the connected lists won't),
              // don't inlcude it in saved nodes.
              var placeholder = element.sortable('option','placeholder');

              // placeholder.element will be a function if the placeholder, has
              // been created (placeholder will be an object).  If it hasn't
              // been created, either placeholder will be false if no
              // placeholder class was given or placeholder.element will be
              // undefined if a class was given (placeholder will be a string)
              if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
                var phElement = placeholder.element();
                // workaround for jquery ui 1.9.x,
                // not returning jquery collection
                phElement = angular.element(phElement);

                // exact match with the placeholder's class attribute to handle
                // the case that multiple connected sortables exist and
                // the placehoilder option equals the class of sortable items
                var excludes = element.find('[class="' + phElement.attr('class') + '"]');

                savedNodes = savedNodes.not(excludes);
              }
            },
            start: function(e, ui){
              ui.item.sortable = {
                index: ui.item.index()
              };
            },
            update: function(e, ui){
              var model = ngModel.$modelValue,
                started = ui.item.sortable.index,
                ended = ui.item.index(),
                before = _.findKey(model, { $priority: started }),
                after = _.findKey(model, { $priority: ended });

              savedNodes.appendTo(element);

              model[before].$priority = ended;
              model[after].$priority = started;
              model.$save();
            }
          });
        }
      };
    }
  ]);
