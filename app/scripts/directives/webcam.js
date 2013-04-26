'use strict';

angular.module('usermediaApp')
  .directive('webcam', function () {
  	var removeLoader = function removeLoader() {
		document.querySelector('.webcam-loader').style.display = "none";
    };

    return {
      template:
      	'<div class="webcam">' +
		'<img class="webcam-loader" src="/images/ajax-loader.gif">' +
		'<video class="webcam-live"></video>' +
      	'</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope:
      {
      	onAccessDenied: '&',
      	onStream: '&',
      	onStreaming: '&'
      },
      link: function postLink($scope, element, attrs) {
        $scope.streaming = false;
        var width = element.width = 320;
        var height = element.height = 0;

        if (!hasUserMedia()) {
        	element.html(alertError);
        	return;
        }

        var videoElem = element.find('video')[0];

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

                /* Start playing the video to show the stream from the webcam*/
                videoElem.play();

                /* Call custom callback */
                if ($scope.onStream) {
                	$scope.onStream({stream: stream, video: videoElem});
                }
            },

            // errorCallback
            function onAccessDenied(err) {
                removeLoader();
                console.log("The following error occured: ", err);
                if ($scope.onAccessDenied) {
                	$scope.onAccessDenied({err:err});
                }

                return;
            }
        );

        /* Start streaming the webcam data when the video element can play
		 * It will do it only once
         */
        videoElem.addEventListener('canplay', function(ev){
          if (!$scope.streaming) {
            height = (videoElem.videoHeight / ((videoElem.videoWidth/width))) || 250;
            videoElem.setAttribute('width', width);
            videoElem.setAttribute('height', height);
            $scope.streaming = true;
            console.log('Started streaming');

            removeLoader();
            /* Call custom callback */
            if ($scope.onStreaming) {
            	$scope.onStreaming({video:videoElem});
            }
          }
        }, false);
      }
    };
  });
