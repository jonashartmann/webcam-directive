/* global Pixastic, requestAnimationFrame */
'use strict';

angular.module('webcamDemo')
  .controller('MainCtrl', function ($scope) {
    var _video = null,
        patData = null;

    $scope.showDemos = false;
    $scope.edgeDetection = false;
    $scope.mono = false;
    $scope.invert = false;

    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

    $scope.webcamError = false;
    $scope.onError = function (err) {
      $scope.$apply(
          function() {
            $scope.webcamError = err;
          }
      );
    };

    $scope.onSuccess = function (videoElem) {
      // The video element contains the captured camera data
      _video = videoElem;
      $scope.$apply(function() {
        $scope.patOpts.w = _video.width;
        $scope.patOpts.h = _video.height;
        $scope.showDemos = true;
      });
    };

    /* jshint unused:false */
    $scope.onStream = function (stream, videoElem) {
        // You could do something manually with the stream.
    };

    /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
    $scope.makeSnapshot = function makeSnapshot() {
      if (_video) {
        var patCanvas = document.querySelector('#snapshot');
        if (!patCanvas) {
          return;
        }

        patCanvas.width = _video.width;
        patCanvas.height = _video.height;
        var ctxPat = patCanvas.getContext('2d');

        var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
        ctxPat.putImageData(idata, 0, 0);

        patData = idata;
      }
    };

    var getVideoData = function getVideoData(x, y, w, h) {
      var hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = _video.width;
      hiddenCanvas.height = _video.height;
      var ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(_video, 0, 0, _video.width, _video.height);
      return ctx.getImageData(x, y, w, h);
    };

    // var getPixelData = function getPixelData(data, width, col, row, offset) {
    //     return data[((row*(width*4)) + (col*4)) + offset];
    // };

    // var setPixelData = function setPixelData(data, width, col, row, offset, value) {
    //     data[((row*(width*4)) + (col*4)) + offset] = value;
    // };

    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
    })();

    var start = Date.now();

    /**
     * Apply a simple edge detection filter.
     */
    function applyEffects(timestamp) {
      var progress = timestamp - start;

      if (_video && $scope.edgeDetection) {
        var videoData = getVideoData(0, 0, _video.width, _video.height);

        var resCanvas = document.querySelector('#result');
        if (!resCanvas) {
          return;
        }

        resCanvas.width = _video.width;
        resCanvas.height = _video.height;
        var ctxRes = resCanvas.getContext('2d');
        ctxRes.putImageData(videoData, 0, 0);

        // apply edge detection to video image
        Pixastic.process(resCanvas, 'edges', {mono:$scope.mono, invert:$scope.invert});
      }

      if (progress < 20000) {
        requestAnimationFrame(applyEffects);
      }
    }

    requestAnimationFrame(applyEffects);
  });
