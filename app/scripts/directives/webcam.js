'use strict';

(function() {
  // GetUserMedia is not yet supported by all browsers
  // Until then, we need to handle the vendor prefixes
  navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  // Checks if getUserMedia is available on the client browser
  window.hasUserMedia = function hasUserMedia() {
    return navigator.getMedia ? true : false;
  }
})();

angular.module('usermedia', [])
  .directive('webcam', function () {
    return {
      template:
      	'<div class="webcam" ng-transclude>' +
		      '<video class="webcam-live"></video>' +
      	'</div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope:
      {
      	onError: '&',
      	onStream: '&',
      	onStreaming: '&',
        placeholder: '='
      },
      link: function postLink($scope, element, attrs) {
        // called when camera stream is loaded
        var onSuccess = function onSuccess(stream) {
          // Firefox supports a src object
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
        };

        // called when any error happens
        var onFailure = function onFailure(err) {
            removeLoader();
            if (console && console.log) {
              console.log("The following error occured: ", err);
            }

            /* Call custom callback */
            if ($scope.onError) {
              $scope.onError({err:err});
            }

            return;
        };

        if ($scope.placeholder) {
          var placeholder = document.createElement('img');
          placeholder.class = 'webcam-loader';
          placeholder.src = $scope.placeholder;
          element.append(placeholder);
        }

        var removeLoader = function removeLoader() {
          if (placeholder) {
            placeholder.remove();
          }
        };

        // Default variables
        var isStreaming = false,
            width = element.width = 320,
            height = element.height = 0;

        // Check the availability of getUserMedia across supported browsers
        if (!hasUserMedia()) {
          onFailure({code:-1, msg: 'Browser does not support getUserMedia.'});
          return;
        }

        var videoElem = element.find('video')[0];

        navigator.getMedia (
            // ask only for video
            {
              video: true,
              audio: false
            },
            onSuccess,
            onFailure
        );

        /* Start streaming the webcam data when the video element can play
		     * It will do it only once
         */
        videoElem.addEventListener('canplay', function(ev){
          if (!isStreaming) {
            height = (videoElem.videoHeight / ((videoElem.videoWidth/width))) || 250;
            videoElem.setAttribute('width', width);
            videoElem.setAttribute('height', height);
            isStreaming = true;
            // console.log('Started streaming');

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
