'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('canvasApp'));

  var MainCtrl,
    CanvasCtrl,
    scope,
    _scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/awesomeThings')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    $httpBackend.expectGET('/api/canvas/undefined')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    _scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    CanvasCtrl = $controller('CanvasCtrl', {
      $scope: _scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toBeUndefined();
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
    dump(_scope);
  });
});
