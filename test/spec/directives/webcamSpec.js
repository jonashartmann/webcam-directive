/* jshint undef:false */
describe('Directive: webcam', function () {
  'use strict';

  const hasModernUserMedia =
    'mediaDevices' in navigator &&
    typeof navigator.mediaDevices.getUserMedia === 'function';

  let element,
    mediaSpy,
    promiseThenSpy,
    promiseCatchSpy,
    onStreamSpy,
    onErrorSpy,
    onSuccessSpy,
    rootScope;

  beforeEach(angular.mock.module('webcam'));

  beforeEach(function () {
    onStreamSpy = jasmine.createSpy('onStreamSpy');
    onErrorSpy = jasmine.createSpy('onErrorSpy');
    onSuccessSpy = jasmine.createSpy('onSuccessSpy');

    if (hasModernUserMedia) {
      promiseCatchSpy = {
        catch: jasmine.createSpy('promiseCatchSpy')
      };

      promiseThenSpy = {
        then: jasmine.createSpy('promiseThenSpy').and.returnValue(promiseCatchSpy)
      };

      navigator.getMedia = mediaSpy = jasmine
        .createSpy('getMediaSpy')
        .and.returnValue(promiseThenSpy);
    } else {
      navigator.getMedia = mediaSpy = jasmine.createSpy('getMediaSpy');
    }
  });

  beforeEach(inject(function ($rootScope, $compile) {
    $rootScope.opts = {};
    $rootScope.onStream = onStreamSpy;
    $rootScope.onError = onErrorSpy;
    $rootScope.onSuccess = onSuccessSpy;
    rootScope = $rootScope;

    element = angular.element(
      '<webcam ' +
      'on-stream="onStream(stream)" ' +
      'on-error="onError(err)" ' +
      'on-streaming="onSuccess()" ' +
      'channel="opts" ' +
      'placeholder="\'http://www.example.com/\'">' +
      '</webcam>'
    );

    element = $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element).not.toBe(null);
  }));

  it('should request only video media', function () {
    expect(mediaSpy).toHaveBeenCalled();

    let args = mediaSpy.calls.mostRecent().args;
    expect(args[0]).not.toBeNull();
    expect(args[0].video).toBeTruthy();
    expect(args[0].audio).toBeFalsy();

    if (!hasModernUserMedia) {
      expect(typeof args[1]).toBe('function');
      expect(typeof args[2]).toBe('function');
    } else {
      expect(promiseThenSpy.then).toHaveBeenCalled();
      args = promiseThenSpy.then.calls.mostRecent().args;
      expect(typeof args[0]).toBe('function');
      expect(promiseCatchSpy.catch).toHaveBeenCalled();
      expect(typeof promiseCatchSpy.catch.calls.mostRecent().args[0]).toBe('function');
    }
  });

  it('should create a video element', function () {
    const video = element.find('video');
    expect(video.length).toBe(1);
    expect(video[0].getAttribute('class')).toBe('webcam-live');
    expect(video[0].getAttribute('autoplay')).toBe('');
  });

  it('should create an image placeholder', function () {
    const image = element.find('img');
    expect(image.length).toBe(1);
    expect(image[0].src).toBe('http://www.example.com/');
    expect(image[0].getAttribute('class')).toBe('webcam-loader');
  });

  describe('on success', function () {
    let video, streamSpy;

    beforeEach(function () {
      video = element.find('video')[0];

      // Mock video.play
      spyOn(video, 'play').and.callFake(function () { });

      // Mock stream
      if (window.MediaStream) {
        streamSpy = new window.MediaStream();
        spyOn(streamSpy, 'getVideoTracks').and.returnValue([{ stop: jasmine.createSpy('stop') }]);
      } else {
        streamSpy = jasmine.createSpyObj('stream', ['stop', 'getVideoTracks']);
      }

      const vendorURL = window.URL || window.webkitURL;
      spyOn(vendorURL, 'createObjectURL').and.returnValue('abc');
    });

    beforeEach(function () {
      let successFn;

      if (hasModernUserMedia) {
        successFn = promiseThenSpy.then.calls.mostRecent().args[0];
      } else {
        successFn = mediaSpy.calls.mostRecent().args[1];
      }

      successFn(streamSpy);
    });

    it('should play the video', function () {
      expect(video.play).toHaveBeenCalled();
    });

    it('should expose the video in parent scope', function () {
      expect(rootScope.opts.video).toBe(video);
    });

    it('should call stream callback', function () {
      expect(onStreamSpy).toHaveBeenCalledWith(streamSpy);
    });

    describe('on scope destroy', function () {
      beforeEach(function () {
        element.scope().$destroy();
      });

      it('should stop video tracks', function () {
        expect(streamSpy.getVideoTracks).toHaveBeenCalled();
      });

      it('should clear video src', function () {
        expect(video.src).toBeFalsy();
      });
    });
  });

  describe('on failure', function () {
    let video;

    beforeEach(function () {
      video = element.find('video')[0];
      spyOn(video, 'play').and.callThrough();
    });

    beforeEach(function () {
      let errorFn;

      if (hasModernUserMedia) {
        errorFn = promiseCatchSpy.catch.calls.mostRecent().args[0];
      } else {
        errorFn = mediaSpy.calls.mostRecent().args[2];
      }

      errorFn('Fake Error');
    });

    it('should not play the video', function () {
      expect(video.play).not.toHaveBeenCalled();
    });

    it('should remove placeholder image', function () {
      const image = element.find('img');
      expect(image.length).toBe(0);
    });

    it('should call error callback', function () {
      expect(onErrorSpy).toHaveBeenCalledWith('Fake Error');
    });
  });

  describe('without user media support', function () {

    beforeEach(function () {
      navigator.getMedia = false;
    });

    beforeEach(inject(function ($rootScope, $compile) {
      $rootScope.onStream = onStreamSpy;
      $rootScope.onError = onErrorSpy;
      $rootScope.onSuccess = onSuccessSpy;

      element = angular.element(
        '<webcam ' +
        'on-stream="onStream(stream,video)" ' +
        'on-error="onError(err)" ' +
        'on-streaming="onSuccess(video)" ' +
        'channel="opts" ' +
        'placeholder="\'http://www.example.com/\'">' +
        '</webcam>'
      );

      element = $compile(element)($rootScope);
      $rootScope.$digest();
      expect(element).not.toBe(null);
    }));

    it('should call failure callback', function () {
      expect(onErrorSpy).toHaveBeenCalled();
      const err = onErrorSpy.calls.mostRecent().args[0];
      expect(err.code).toBe(-1);
    });
  });
});
