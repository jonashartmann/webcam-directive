# Webcam manipulation with HTML5

[![Build Status](https://travis-ci.org/jonashartmann/webcam-directive.png?branch=master)](https://travis-ci.org/jonashartmann/webcam-directive)
[![Code Climate](https://codeclimate.com/github/jonashartmann/webcam-directive.png)](https://codeclimate.com/github/jonashartmann/webcam-directive)

This is an [AngularJS][] directive that can be added as a module to your own app.

Demos can be found at [http://jonashartmann.github.io/webcam-directive](http://jonashartmann.github.io/webcam-directive)

## Contribute

1. Fork and clone this repository
2. Install dependencies

		npm install
3. Build/test with grunt

		grunt test
4. Make a Pull Request (it will only be merged if it passes the Travis build)

Or just help by creating issues.

## Download

#### Using [Bower](http://bower.io/)
```shell
bower install webcam-directive
```

#### You can also find the current version inside the dist/ folder
	Ex.: dist/<version_number>/webcam.min.js

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

#### Then just use the new element
```
<webcam></webcam>
```

#### Callbacks
```js
<webcam on-stream="onStream(stream,video)"
	        on-error="onError(err)"
	        on-streaming="onSuccess(video)">
		</webcam>
```

#### Custom placeholder to be shown while loading the webcam
```js
<webcam placeholder="'img/ajax-loader.gif'">
```

## Technologies used in this project

- [AngularJS][]
- [Yeoman](http://yeoman.io/)
- [getUserMedia](https://developer.mozilla.org/en-US/docs/WebRTC/navigator.getUserMedia)
- [canvas](https://developer.mozilla.org/en-US/docs/HTML/Canvas)
- [video](https://developer.mozilla.org/en-US/docs/HTML/Element/video)

The code is licensed under the MIT License. @see LICENSE file

[angularjs]:http://angularjs.org
