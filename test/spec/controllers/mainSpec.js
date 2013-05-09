'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webcamDemo'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should exist', function () {
    expect(MainCtrl).not.toBe(null);
  });
});
