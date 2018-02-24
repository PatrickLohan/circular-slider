const _init = Symbol('init');
const _createRootSVG = Symbol('createRootSVG');
const _initSlider = Symbol("addSliderToRootSVG");
const _createSliderCircle = Symbol('createSliderCircle');
const _createEmptyCircle = Symbol('createEmptyCircle');
const _createCircle = Symbol('createSlider');
const _createHandle = Symbol('createHandle');

const STROKE_WIDTH = 15;

export default class CircularSlider {

    defaults = {
        container: "slider",
        color: "green",
        max: 100,
        min: 0,
        step: 1,
        radius: 50
    };

    constructor(options) {
        this.options = {...this.defaults, ...options};

        this[_init]();
    }



    /**
     * Initializes (calculates values of) all properties and creates a slider.
     */
    [_init]() {
        const container = document.getElementById(this.options.container);

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
    [_createRootSVG]() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "id", "sliderRootSVG");
        svg.setAttributeNS(null, "height", "100%");
        svg.setAttributeNS(null, "width", "100%");

        return svg;
    }

    /**
     * Creates slider composed of underlying stripped SVG circle and top colored circle which will behave as slider.
     */
    [_initSlider]() {
        const container = document.getElementById(this.options.container);

        // create root svg only when the first slider is added to the container.
        let rootSVG = document.getElementById("sliderRootSVG");
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
    [_createSliderCircle]() {
        const slider = this[_createCircle]();

        slider.setAttributeNS(null, 'class', 'top-slider');
        slider.style.stroke = this.options.color;
        slider.style.strokeWidth = STROKE_WIDTH + "px";

        slider.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        slider.style.strokeDashoffset = `${this.circumference}`;

        return slider;
    }

    /**
     * Creates new SVG circle used as empty "underlying" slider.
     */
    [_createEmptyCircle]() {
        const slider = this[_createCircle]();

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
    [_createCircle]() {
        const slider = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        slider.setAttributeNS(null, "cx", "" + this.centerX);
        slider.setAttributeNS(null, "cy", "" + this.centerY);
        slider.setAttributeNS(null, "r", "" + this.radius);
        slider.setAttributeNS(null, "fill", "none");

        return slider;
    }

    /**
     * Creates a handle for the slider.
     */
    [_createHandle]() {
        const handle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        handle.setAttributeNS(null, "cx", "" + this.centerX);
        handle.setAttributeNS(null, "cy", "" + (this.centerY - this.radius));
        handle.setAttributeNS(null, "r", "" + (STROKE_WIDTH / 2 + 2));
        handle.setAttributeNS(null, "fill", "red");
        handle.setAttributeNS(null, "class", "handle");
        handle.style.stroke = "#CFCFD0";
        handle.style.strokeWidth = "1px";

        return handle;
    }
}