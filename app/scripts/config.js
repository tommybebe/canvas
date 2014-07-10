'use strict';
// variation file naming rule example.html, example.2.html, example.3.html...
var experiments = [
  {'canvas-item.html': 1},
  {'canvas-item.html': 0}
];

angular.module('config', ['ng'])
  .constant('TEST', 'Hello world!')
  .constant('FIREBASE_URI', 'https://burning-fire-8122.firebaseio.com')
  .constant('EXPERIMENTS', experiments)
  .factory('$experiment', [function(){
    return function(path, cache){
      var variation = cxApi.chooseVariation();

      angular.forEach(experiments[variation], function(number, html){
        var picked = html.replace('.html', '.'+number+'.html');
        cache.put('partials/'+html, cache.get('partials/'+picked));
      });
    };
  }]);