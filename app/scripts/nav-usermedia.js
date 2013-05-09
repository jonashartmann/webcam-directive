(function() {
	'use strict';
	navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

	window.hasUserMedia = function hasUserMedia() {
		return navigator.getMedia ? true : false;
	};
})();
