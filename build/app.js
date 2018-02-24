/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CircularSlider = __webpack_require__(1);

var _CircularSlider2 = _interopRequireDefault(_CircularSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
    container: "slider",
    color: "purple",
    max: 2000,
    min: 0,
    step: 10,
    radius: 200
};

var slider = new _CircularSlider2.default(options);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _init = Symbol('init');
var _createRootSVG = Symbol('createRootSVG');
var _initSlider = Symbol("addSliderToRootSVG");
var _createSliderCircle = Symbol('createSliderCircle');
var _createEmptyCircle = Symbol('createEmptyCircle');
var _createCircle = Symbol('createSlider');
var _createHandle = Symbol('createHandle');

var STROKE_WIDTH = 15;

var CircularSlider = function () {
    function CircularSlider(options) {
        _classCallCheck(this, CircularSlider);

        this.defaults = {
            container: "slider",
            color: "green",
            max: 100,
            min: 0,
            step: 1,
            radius: 50
        };

        this.options = _extends({}, this.defaults, options);

        this[_init]();
    }

    /**
     * Initializes (calculates values of) all properties and creates a slider.
     */


    _createClass(CircularSlider, [{
        key: _init,
        value: function value() {
            var container = document.getElementById(this.options.container);

            // calculate container's center
            this.centerX = container.offsetWidth / 2;
            this.centerY = container.offsetHeight / 2;
            this.radius = this.options.radius - STROKE_WIDTH; // subtract border width from radius
            this.circumference = this.options.radius * 2 * Math.PI;

            this[_initSlider]();
        }

        /**
         * Creates root svg to which all sliders residing in the same container are later appended.
         * @returns {SVGCircleElement}
         */

    }, {
        key: _createRootSVG,
        value: function value() {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS(null, "id", "sliderRootSVG");
            svg.setAttributeNS(null, "height", "100%");
            svg.setAttributeNS(null, "width", "100%");

            return svg;
        }

        /**
         * Creates slider composed of underlying stripped SVG circle and top colored circle which will behave as slider.
         */

    }, {
        key: _initSlider,
        value: function value() {
            var container = document.getElementById(this.options.container);

            // create root svg only when the first slider is added to the container.
            var rootSVG = document.getElementById("sliderRootSVG");
            if (rootSVG === null) {
                rootSVG = this[_createRootSVG]();
                container.appendChild(rootSVG);
            }

            this.slider = this[_createSliderCircle]();
            this.handle = this[_createHandle]();

            rootSVG.appendChild(this[_createEmptyCircle]());
            rootSVG.appendChild(this.slider);
            rootSVG.appendChild(this.handle);
        }

        /**
         * Creates new SVG circle used as a top slider.
         */

    }, {
        key: _createSliderCircle,
        value: function value() {
            var slider = this[_createCircle]();

            slider.setAttributeNS(null, 'class', 'top-slider');
            slider.style.stroke = this.options.color;
            slider.style.strokeWidth = STROKE_WIDTH + "px";

            slider.style.strokeDasharray = this.circumference + ' ' + this.circumference;
            slider.style.strokeDashoffset = '' + this.circumference;

            return slider;
        }

        /**
         * Creates new SVG circle used as empty "underlying" slider.
         */

    }, {
        key: _createEmptyCircle,
        value: function value() {
            var slider = this[_createCircle]();

            slider.setAttributeNS(null, 'class', 'dashed-circle');
            slider.style.strokeWidth = STROKE_WIDTH + "px";
            slider.style.strokeDasharray = "5, 1";

            return slider;
        }

        /**
         * Creates new SVG circle element based on passed options.
         *
         * @returns {SVGCircleElement}
         */

    }, {
        key: _createCircle,
        value: function value() {
            var slider = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            slider.setAttributeNS(null, "cx", "" + this.centerX);
            slider.setAttributeNS(null, "cy", "" + this.centerY);
            slider.setAttributeNS(null, "r", "" + this.radius);
            slider.setAttributeNS(null, "fill", "none");

            return slider;
        }

        /**
         * Creates a handle for the slider.
         */

    }, {
        key: _createHandle,
        value: function value() {
            var handle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            handle.setAttributeNS(null, "cx", "" + this.centerX);
            handle.setAttributeNS(null, "cy", "" + (this.centerY - this.radius));
            handle.setAttributeNS(null, "r", "" + (STROKE_WIDTH / 2 + 2));
            handle.setAttributeNS(null, "fill", "red");
            handle.setAttributeNS(null, "class", "handle");
            handle.style.stroke = "#CFCFD0";
            handle.style.strokeWidth = "1px";

            return handle;
        }
    }]);

    return CircularSlider;
}();

exports.default = CircularSlider;

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map