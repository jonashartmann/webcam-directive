/* jshint undef:false */
describe('Directive: webcam', function () {
  'use strict';

  var element;

  beforeEach(module('webcam'));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<webcam placeholder="\'http://www.example.com/\'"></webcam>');
    element = $compile(element)($rootScope);
    expect(element).not.toBe(null);
  }));


  it('should create a video element', function () {
    var video = element.find('video');
    expect(video.length).toBe(1);
    expect(video[0].getAttribute('class')).toBe('webcam-live');
    expect(video[0].getAttribute('autoplay')).toBe('');
  });

  it('should create an image for the placeholder',
    function() {
      var image = element.find('img');
      expect(image.length).toBe(1);
      expect(image[0].getAttribute('src')).toBe('http://www.example.com/');
      expect(image[0].getAttribute('class')).toBe('webcam-loader');
    }
  );
});
