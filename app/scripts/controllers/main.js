'use strict';

angular.module('usermediaApp')
  .controller('MainCtrl', function ($scope) {
    var xPat = 0,
        yPat = 0,
        wPat = 100,
        hPat = 100,
        _canvas = null,
        _video = null,
        patData = null;

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

    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
    })();

    var start = Date.now();

    function searchPattern(timestamp) {
      var progress = timestamp - start;

      if (_video && _canvas && patData) {
        // console.log('Searching for pattern');
        var ctx = _canvas.getContext('2d'),
            videoData = getVideoData(0, 0, _video.width, _video.height),
            data = videoData.data;

        for (var i = 0, len = data.length; i < len; i+=4) {
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            var a = data[i+3];

            // Makes the image gray scale only
            var brightness = (3*r+4*g+b)>>>3;
            data[i] = brightness;
            data[i+1] = brightness;
            data[i+2] = brightness;

            // TODO: search pattern
        }

        var patCanvas = document.querySelector('#pattern');
        var ctxPat = patCanvas.getContext('2d');
        ctxPat.putImageData(videoData, 0, 0);
      } else {
        // console.log('Pattern not ready yet');
      }

      if (progress < 2000) {
        requestAnimationFrame(searchPattern);
      }
    }

    requestAnimationFrame(searchPattern);
  });
