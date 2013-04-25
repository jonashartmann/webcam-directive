'use strict';

describe('Directive: webcam', function () {
  beforeEach(module('usermediaApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<webcam></webcam>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the webcam directive');
  }));
});
