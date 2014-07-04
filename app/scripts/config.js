'use strict';
// experiment = cxApi.getChosenVariation('-------'),
var experiments = [
  //{ id: 'key', name: 'test1', variation: [{canvasSideBar:'canvasSideBar-trial1.html'}, {canvasSideBar:'canvasSideBar-trial2.html'}] }
],
templates = {
  canvasSideBar: 'partials/canvas-side-bar.html',
  canvasItem: 'partials/canvas-item.html',
  notFound: 'partials/notFound/404.html'
};

angular.forEach(experiments, function(experiment){
  var variationNumber = cxApi.getChosenVariation(experiment.id),
    variation = experiment.variation[variationNumber];
  angular.forEach(Object.keys(variation), function(template){
    templates[template] = variation[template];
  });
});

angular.module('config', [])
	.constant('TEST', 'Hello world!')
  .constant('FIREBASE_URI', 'https://burning-fire-8122.firebaseio.com')
  .constant('TEMPLATE', templates)
;