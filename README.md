# Webcam manipulation with HTML5 [![CI](https://github.com/jonashartmann/webcam-directive/actions/workflows/ci.yml/badge.svg)](https://github.com/jonashartmann/webcam-directive/actions/workflows/ci.yml)
An [AngularJS][] directive to manipulate the webcam.

You can easily add it as a module to your own app.

A complete example can be found at [http://jonashartmann.github.io/webcam-directive](http://jonashartmann.github.io/webcam-directive) (*gh-pages*)

## Download
[![NPM](https://nodei.co/npm/webcam.png?compact=true)](https://nodei.co/npm/webcam/)

#### Using [NPM](http://www.npmjs.com)
```shell
npm install webcam
```
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
### see more examples [wiki](https://github.com/jonashartmann/webcam-directive/wiki)


## Contribute

1. Fork and clone this repository
2. Install dependencies
```shell
npm install
```

3. Build/test with karma

Ensure you have Chromium installed with CHROMIUM_BIN set to its path
```shell
npm run test
```

4. Make a Pull Request 

**Recommended: Test locally,** as
_it will only be merged if it builds successfully._

Or just help by creating issues.

## License

The code is licensed under the MIT License. @see LICENSE file

[angularjs]:http://angularjs.org
