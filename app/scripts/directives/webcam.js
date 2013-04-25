'use strict';

angular.module('usermediaApp')
  .directive('webcam', function () {
  	var alertError =
  		'<div class="alert alert-error">' +
        	'<span>Sorry, your webcam cannot be accessed.</span>' +
        '</div>';

    var alertLoading =
    	'<div class="alert alert-warning">' +
    		'<span>Loading webcam... Please allow access to it.</span>' +
    	'</div>';

    var alertShy =
    	'<div class="alert alert-error">' +
    		'<span>Why not? Are you shy?!</span>' +
    	'</div>';

    return {
      template: '<div><video id="webcam-live"></video>' +
		'<img id="webcam-loader" src="/images/ajax-loader.gif">' +
      	'</div>',
      restrict: 'E',
      replace: true,
      link: function postLink($scope, element, attrs) {
        $scope.streaming = false;
        var width = element.width = 320;
        var height = element.height = 0;

        if (!hasUserMedia()) {
        	element.html(alertError);
        	return;
        }

        var videoElem = document.querySelector('#webcam-live');

        navigator.getMedia (
            // ask only for video
            {
              video: true,
              audio: false
            },

            // successCallback
            function onVideoStream(stream) {
                if (navigator.mozGetUserMedia) {
                  videoElem.mozSrcObject = stream;
                } else {
                  var vendorURL = window.URL || window.webkitURL;
                  videoElem.src = vendorURL.createObjectURL(stream);
                }
                videoElem.play();
            },

            // errorCallback
            function onAccessDenied(err) {
                console.log("The following error occured: ", err);
                if (err.PERMISSION_DENIED) {
                	element.html(alertShy);
                } else {
                	element.html(alertError);
                }
        		return;
            }
        );

        videoElem.addEventListener('canplay', function(ev){
          if (!$scope.streaming) {
            height = (videoElem.videoHeight / ((videoElem.videoWidth/width))) || 250;
            videoElem.setAttribute('width', width);
            videoElem.setAttribute('height', height);
            // canvas.setAttribute('width', width);
            // canvas.setAttribute('height', height);
            $scope.streaming = true;
            console.log('Started streaming');

            document.querySelector('#webcam-loader').style.display = "none";
          }
        }, false);
      }
    };
  });
