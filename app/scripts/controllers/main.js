'use strict';

angular.module('usermediaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.onError = function (err) {
        document.querySelector('.webcam').innerHTML =
            '<div class="alert alert-error">'+
            '<span>Webcam could not be started. Did you give access to it?</span>'+
            '</div>';
    };

    $scope.onSuccess = function (video) {
        console.log('Streaming: ', video);
    };

    $scope.onStream = function (stream, video) {
        console.log(stream, video);
    };
  });
