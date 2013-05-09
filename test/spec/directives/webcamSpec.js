'use strict';

describe('Directive: webcam', function () {

  var element;

  beforeEach(module('webcam'));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<webcam></webcam>');
    element = $compile(element)($rootScope);
    expect(element).not.toBe(null);
  }));

  it('should create a video element', function () {
    var video = element.find('video');
    expect(video).not.toBe(null);
  });
});
