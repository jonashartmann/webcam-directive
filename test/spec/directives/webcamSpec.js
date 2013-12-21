/* jshint undef:false */
describe('Directive: webcam', function () {
  'use strict';

  var element,
      mediaSpy,
      onStreamSpy,
      onErrorSpy,
      onSuccessSpy;

  beforeEach(module('webcam'));

  beforeEach(function createSpy () {
    navigator.getMedia = mediaSpy = jasmine.createSpy('getMediaSpy');
    onStreamSpy = jasmine.createSpy('onStreamSpy');
    onErrorSpy = jasmine.createSpy('onErrorSpy');
    onSuccessSpy = jasmine.createSpy('onSuccessSpy');
  });

  beforeEach(inject(function ($rootScope, $compile) {
    $rootScope.onStream = onStreamSpy;
    $rootScope.onError = onErrorSpy;
    $rootScope.onSuccess = onSuccessSpy;
    element = angular.element(
      '<webcam '+
      'on-stream="onStream(stream,video)" '+
      'on-error="onError(err)" '+
      'on-streaming="onSuccess(video)" '+
      'placeholder="\'http://www.example.com/\'">'+
      '</webcam>');
    element = $compile(element)($rootScope);
    expect(element).not.toBe(null);
  }));

  it('should get only video media from the navigator',
    function() {
      expect(mediaSpy).toHaveBeenCalled();
      var args = mediaSpy.mostRecentCall.args;
      expect(args[0]).not.toBeNull();
      expect(args[0].video).toBeTruthy();
      expect(args[0].audio).toBeFalsy(); // Needs to be changed if audio support is added
      expect(typeof args[1]).toBe('function');
      expect(typeof args[2]).toBe('function');
    }
  );

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

  describe('on success', function () {
    var video,
        streamSpy;

    beforeEach(function () {
      video = element.find('video')[0];
      spyOn(video, 'play');
      streamSpy = jasmine.createSpyObj('stream', ['stop']);

      // createObjectURL throws a Type Error if passed a spy
      var vendorURL = window.URL || window.webkitURL;
      spyOn(vendorURL, 'createObjectURL').andReturn('abc');

      var args = mediaSpy.mostRecentCall.args;
      args[1](streamSpy); // call success function
    });

    it('should play the video element', function() {
      expect(video.play).toHaveBeenCalled();
    });

    it('should call the stream callback', function() {
      expect(onStreamSpy).toHaveBeenCalledWith(streamSpy, video);
    });

    describe('scope destruction', function() {
      beforeEach(function() {
        expect(video.src).not.toBe('');
        element.scope().$destroy();
      });

      it('should stop the video stream', function() {
        runs(function() { expect(streamSpy.stop).toHaveBeenCalled(); });
      });

      it('should clear the video element src', function() {
        runs(function() { expect(video.src).toBe(''); });
      });
    });
  });

  describe('on failure', function () {
    var video;

    beforeEach(function () {
      video = element.find('video')[0];
      spyOn(video, 'play').andCallThrough();
      var args = mediaSpy.mostRecentCall.args;
      args[2]('Fake Error'); // call failure function
    });

    it('should remove the placeholder', function () {
      var image = element.find('img');
      expect(image.length).toBe(0);
    });

    it('should call the error callback', function () {
      expect(onErrorSpy).toHaveBeenCalled();
      expect(onErrorSpy.mostRecentCall.args[0]).toBe('Fake Error');
    });
  });

  describe('without user media support', function() {

    beforeEach(function () {
      navigator.getMedia = false;
    });

    beforeEach(inject(function ($rootScope, $compile) {
      $rootScope.onStream = onStreamSpy;
      $rootScope.onError = onErrorSpy;
      $rootScope.onSuccess = onSuccessSpy;
      element = angular.element(
        '<webcam '+
        'on-stream="onStream(stream,video)" '+
        'on-error="onError(err)" '+
        'on-streaming="onSuccess(video)" '+
        'placeholder="\'http://www.example.com/\'">'+
        '</webcam>');
      element = $compile(element)($rootScope);
      expect(element).not.toBe(null);
    }));

    it('should call the failure callback',
      function() {
        expect(onErrorSpy).toHaveBeenCalled();
        expect(onErrorSpy.mostRecentCall.args[0]).not.toBeNull();
        expect(onErrorSpy.mostRecentCall.args[0].code).toBe(-1);
      }
    );
  });

});
