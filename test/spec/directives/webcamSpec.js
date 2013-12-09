/* jshint undef:false */
describe('Directive: webcam', function () {
  'use strict';

  var element;

  beforeEach(module('webcam'));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<webcam></webcam>');
    element = $compile(element)($rootScope);
    expect(element).not.toBe(null);
  }));

  it('should create a video element', function () {
    var video = element.find('video');
    expect(video.length).toBe(1);
    expect(video[0].getAttribute('class')).toBe('webcam-live');
    expect(video[0].getAttribute('autoplay')).toBe('');
  });
});
