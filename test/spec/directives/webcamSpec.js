/* jshint undef:false */
describe('Directive: webcam', function () {
  'use strict';

  var ua = navigator.userAgent,
      phantomjs = /phantom/i.test(ua),
      hasModernUserMedia = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  if (phantomjs) {
    console.log('PhantomJS detected; video.play will be mocked');
  }

  var element,
      mediaSpy,
      promiseThenSpy,
      promiseCatchSpy,
      onStreamSpy,
      onErrorSpy,
      onSuccessSpy,
      rootScope;

  beforeEach(module('webcam'));

  beforeEach(function createSpy () {
    if (hasModernUserMedia) {
      promiseCatchSpy = {
        catch: jasmine.createSpy('promiseCatchSpy')
      };

      promiseThenSpy = {
        then: jasmine.createSpy('promiseThenSpy').andReturn(promiseCatchSpy),
      };
      navigator.getMedia = mediaSpy = jasmine.createSpy('getMediaSpy').andReturn(promiseThenSpy);
    } else {
      navigator.getMedia = mediaSpy = jasmine.createSpy('getMediaSpy');
    }

    onStreamSpy = jasmine.createSpy('onStreamSpy');
    onErrorSpy = jasmine.createSpy('onErrorSpy');
    onSuccessSpy = jasmine.createSpy('onSuccessSpy');
  });

  beforeEach(inject(function ($rootScope, $compile) {
    $rootScope.opts = {
      // video: null
    };
    $rootScope.onStream = onStreamSpy;
    $rootScope.onError = onErrorSpy;
    $rootScope.onSuccess = onSuccessSpy;
    rootScope = $rootScope;
    element = angular.element(
      '<webcam '+
      'on-stream="onStream(stream)" '+
      'on-error="onError(err)" '+
      'on-streaming="onSuccess()" '+
      'channel="opts"' +
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

      if (!hasModernUserMedia) {
        expect(typeof args[1]).toBe('function');
        expect(typeof args[2]).toBe('function');
      } else {
        expect(promiseThenSpy.then).toHaveBeenCalled();
        args = promiseThenSpy.then.mostRecentCall.args;
        expect(typeof args[0]).toBe('function');
        expect(promiseCatchSpy.catch).toHaveBeenCalled();
        args = promiseCatchSpy.catch.mostRecentCall.args;
        expect(typeof args[0]).toBe('function');
      }
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
      if (phantomjs) { // phantomjs doesn't support video
        video.play = jasmine.createSpy('play');
      } else {
        spyOn(video, 'play');
      }

      if (!!window.MediaStream) {
        streamSpy = new window.MediaStream();
        spyOn(streamSpy, 'getVideoTracks');
      } else {
        streamSpy = jasmine.createSpyObj('stream', ['stop', 'getVideoTracks']);
      }

      // createObjectURL throws a Type Error if passed a spy
      var vendorURL = window.URL || window.webkitURL;
      spyOn(vendorURL, 'createObjectURL').andReturn('abc');
    });

    beforeEach(function() {
      var args = mediaSpy.mostRecentCall.args;
      var successFunction = args[1]; // call success function

      if (hasModernUserMedia) {
        successFunction = promiseThenSpy.then.mostRecentCall.args[0];
      }

      successFunction(streamSpy);
    });

    it('should play the video element', function() {
      expect(video.play).toHaveBeenCalled();
    });

    it('should make the video element available for the parent scope',
      function () {
      expect(rootScope.opts.video).not.toBeUndefined();
      expect(rootScope.opts.video).not.toBeNull();
      expect(rootScope.opts.video).toBe(video);
    });

    it('should call the stream callback', function() {
      expect(onStreamSpy).toHaveBeenCalledWith(streamSpy);
    });

    describe('scope destruction', function() {
      beforeEach(function() {
        if (!hasModernUserMedia) { expect(video.src).toBeTruthy(); }
        else { expect(video.srcObject).toBeTruthy(); }

        element.scope().$destroy();
      });

      it('should stop the video stream using video tracks', function () {
        expect(streamSpy.getVideoTracks).toHaveBeenCalled();
      });

      it('should clear the video element src', function() {
        runs(function() { expect(video.src).toBeFalsy(); }); // empty or null
      });
    });
  });

  describe('on failure', function () {
    var video;

    beforeEach(function () {
      video = element.find('video')[0];
      if (phantomjs) { // phantomjs doesn't support video
        video.play = jasmine.createSpy('play');
      } else {
        spyOn(video, 'play').andCallThrough();
      }
    });

    beforeEach(function() {
      var args = mediaSpy.mostRecentCall.args;
      var errorFunction = args[2]; // call failure function

      if (hasModernUserMedia) {
        errorFunction = promiseCatchSpy.catch.mostRecentCall.args[0];
      }

      errorFunction('Fake Error');
    });

    it('should not play the video element', function() {
      expect(video.play).not.toHaveBeenCalled();
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
