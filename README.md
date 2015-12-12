# Webcam manipulation with HTML5

An [AngularJS][] directive to manipulate the webcam.

[![Build Status](https://travis-ci.org/jonashartmann/webcam-directive.png?branch=master)](https://travis-ci.org/jonashartmann/webcam-directive)
[![Code Climate](https://codeclimate.com/github/jonashartmann/webcam-directive.png)](https://codeclimate.com/github/jonashartmann/webcam-directive)

You can easily add it as a module to your own app.

A complete example can be found at [http://jonashartmann.github.io/webcam-directive](http://jonashartmann.github.io/webcam-directive) (*gh-pages*)

## Download
[![NPM](https://nodei.co/npm/webcam.png?compact=true)](https://nodei.co/npm/webcam/)

#### Using [Bower](http://bower.io/)
```shell
bower install webcam-directive
```

#### There is a tag for each version, with the built javascript file inside the _dist_ directory
	Ex.: dist/webcam.min.js

## Installation

#### Using script tag
```html
<script type="text/javascript" src="webcam.min.js"></script>
```

## Usage

#### Add module "webcam" as dependency
```js
angular.module('myapp', ['webcam']);
```

#### Then add the new element in HTML
```html
<webcam></webcam>
```

## Advanced Usage
#### Set a custom placeholder image to be shown while loading the stream
```html
<webcam placeholder="'img/ajax-loader.gif'">
```

#### Callbacks
```js
function MyController($scope) {
  $scope.onError = function (err) {...};
  $scope.onStream = function (stream) {...};
  $scope.onSuccess = function () {...};
}
```
```html
<webcam
  on-stream="onStream(stream)"
  on-streaming="onSuccess()"
  on-error="onError(err)">
</webcam>
```
#### Set a channel to bind data
```js
function MyController($scope) {
  $scope.myChannel = {
    // the fields below are all optional
    videoHeight: 800,
    videoWidth: 600,
    video: null // Will reference the video element on success
  };
}
```
```html
<webcam
  channel="myChannel">
</webcam>
```



## Contribute

1. Fork and clone this repository
2. Install dependencies

    npm install
3. Build/test with grunt

    grunt test
4. Make a Pull Request (it will only be merged if it passes the Travis build)

Or just help by creating issues.

## Technologies used in this project

- [AngularJS][]
- [Yeoman](http://yeoman.io/)
- [getUserMedia](https://developer.mozilla.org/en-US/docs/WebRTC/navigator.getUserMedia)
- [canvas](https://developer.mozilla.org/en-US/docs/HTML/Canvas)
- [video](https://developer.mozilla.org/en-US/docs/HTML/Element/video)

The code is licensed under the MIT License. @see LICENSE file

[angularjs]:http://angularjs.org
