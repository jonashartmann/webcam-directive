'use strict';

angular.module('usermediaApp')
  .controller('MainCtrl', function ($scope) {
    // var streaming = false,
    //       video        = document.querySelector('#video'),
    //       cover        = document.querySelector('#cover'),
    //       canvas       = document.querySelector('#canvas'),
    //       photo        = document.querySelector('#photo'),
    //       startbutton  = document.querySelector('#startbutton'),
    //       width = 320,
    //       height = 0;

    // $scope.accessCamera = function accessCamera() {
    //     console.log('Ask user permission');
    //     navigator.getMedia (
    //         // constraints
    //         {
    //           video: true,
    //           audio: false
    //         },

    //         // successCallback
    //         function(stream) {
    //             $scope.hasAccess = true;

    //             if (navigator.mozGetUserMedia) {
    //               video.mozSrcObject = stream;
    //             } else {
    //               var vendorURL = window.URL || window.webkitURL;
    //               video.src = vendorURL.createObjectURL(stream);
    //             }
    //             video.play();
    //         },

    //         // errorCallback
    //         function(err) {
    //             console.log("The following error occured: ", err);
    //         }

    //     );
    // }

    // video.addEventListener('canplay', function(ev){
    //   if (!streaming) {
    //     height = (video.videoHeight / ((video.videoWidth/width))) || 250;
    //     video.setAttribute('width', width);
    //     video.setAttribute('height', height);
    //     canvas.setAttribute('width', width);
    //     canvas.setAttribute('height', height);
    //     streaming = true;
    //     console.log('Started streaming');
    //   }
    // }, false);

    // $scope.takePicture = function takePicture() {
    //     canvas.width = width;
    //     canvas.height = height;
    //     canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    //     var data = canvas.toDataURL('image/png');
    //     photo.setAttribute('src', data);
    //     console.log('Picture taken!');
    // };
  });
