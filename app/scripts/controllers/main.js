'use strict';

angular.module('usermediaApp')
  .controller('MainCtrl', function ($scope) {
    var xPat = 150,
        yPat = 100,
        wPat = 25,
        hPat = 25,
        _canvas = null,
        _video = null,
        patData = null;

    $scope.mono = true;
    $scope.invert = false;
    $scope.bias = 0;
    $scope.factor = 1;

    $scope.onError = function (err) {
        document.querySelector('.webcam').innerHTML =
            '<div class="alert alert-error">'+
            '<span>Webcam could not be started. Did you give access to it?</span>'+
            '</div>';
    };

    $scope.onSuccess = function (video) {
        console.log('Streaming: ', video);
        _video = video;
        _canvas = document.querySelector('#mask');
        var width = video.width,
            height = video.height;

        if (_canvas) {
            _canvas.width = width;
            _canvas.height = height;
            var ctx = _canvas.getContext('2d');

            console.log('Filling rectange ' + '[' + width + ',' + height + ']');
            ctx.strokeStyle = 'green';
            ctx.strokeRect(xPat, yPat, wPat + 1, hPat + 1);
            ctx.clearRect(xPat, yPat, wPat, hPat);
        }
    };

    $scope.onStream = function (stream, video) {
        console.log(stream, video);
    };

    $scope.getPattern = function getPattern() {
        if (_canvas) {
            console.log('Pattern!');

            var idata = getVideoData(xPat, yPat, wPat, hPat);
            var patCanvas = document.querySelector('#pattern');
            patCanvas.width = _canvas.width;
            patCanvas.height = _canvas.height;
            var ctxPat = patCanvas.getContext('2d');
            ctxPat.putImageData(idata, 0, 0);

            patData = idata;
        }
    };

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _canvas.width;
        hiddenCanvas.height = _canvas.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
        return ctx.getImageData(x, y, w, h);
    };

    var getPixelData = function getPixelData(data, width, col, row, offset) {
        return data[((row*(width*4)) + (col*4)) + offset];
    };

    var setPixelData = function setPixelData(data, width, col, row, offset, value) {
        data[((row*(width*4)) + (col*4)) + offset] = value;
    };

    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
    })();

    var start = Date.now();

    function searchPattern(timestamp) {
      var progress = timestamp - start;

      if (_video && _canvas && patData) {
        var ctx = _canvas.getContext('2d'),
            videoData = getVideoData(0, 0, _video.width, _video.height);

        var patCanvas = document.querySelector('#pattern');
        var ctxPat = patCanvas.getContext('2d');
        ctxPat.putImageData(patData, 0, 0);

        // Apply edge detection to pattern
        Pixastic.process(patCanvas, "edges", {mono:$scope.mono, invert:$scope.invert});

        var resCanvas = document.querySelector('#result');
        resCanvas.width = _video.width;
        resCanvas.height = _video.height;
        var ctxRes = resCanvas.getContext('2d');
        ctxRes.putImageData(videoData, 0, 0);

        // apply edge detection to video image
        Pixastic.process(resCanvas, "edges", {mono:$scope.mono, invert:$scope.invert});

        // for (var i = 0, len = data.length; i < len; i+=4) {
        //     for (var j = 0, plen = pData.length; j < plen; j+=4) {
        //         var r = data[i];
        //         var g = data[i+1];
        //         var b = data[i+2];
        //         var a = data[i+3];
        //     }
        // }

      }

      if (progress < 2000) {
        requestAnimationFrame(searchPattern);
      }
    }

    requestAnimationFrame(searchPattern);
  });
