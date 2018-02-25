const _init = Symbol('init');
const _createRootSVG = Symbol('createRootSVG');
const _initSlider = Symbol("addSliderToRootSVG");
const _createSliderCircle = Symbol('createSliderCircle');
const _createEmptyCircle = Symbol('createEmptyCircle');
const _createCircle = Symbol('createSlider');
const _createHandle = Symbol('createHandle');
const _deg2Step = Symbol('deg2Step');
const _step2Deg = Symbol('step2Deg');
const _valToDeg = Symbol('valToStep');
const _radToDeg = Symbol('radToDeg');
const _degToRadius = Symbol('degToRadius');
const _deg2Val = Symbol('deg2Val');
const _move = Symbol('move');

const STROKE_WIDTH = 15;
const HANDLER_RADIUS = (STROKE_WIDTH / 2) + 2;

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

        // TODO: validate params - max>min, (max - min) % step == 0

        this[_init]();
    }

    get currentValue() {
        return this.options.min + (this.currentStepNo * this.options.step)
    }

    get currentStep() {
        return this.currentStepNo;
    }

    /**
     * Sets slider value based on the provided step number. We don't allow setting the value directly since
     * it can only be set to numbers divisible by step (this.options.step).
     *
     * @param stepNo
     */
    set step(stepNo) {
        // if (isNaN(parseFloat(stepNo)) || stepNo < 0 || stepNo > this.maxSteps)
        //     throw new Error("Step number " + stepNo + " is not between 0 and " + maxSteps);
        //
        // TODO:
        // 1. given stepNo, calculate where this is in orbit (endX, endY)
        // 2. setInterval(move) through orbit until reaching endX, endY OR CANCELED BY another event
    }

    [_move](x, y) {
        // adjust based on container's position
        x -= this.containerOffsetLeft;
        y -= this.containerOffsetTop;

        // calculate x and y from - atan(x and y) are switched in the formula
        const angelRadRotated = Math.atan2(x - this.centerX, y - this.centerY);
        const newX = Math.sin(angelRadRotated) * this.radius;
        const newY = Math.cos(angelRadRotated) * this.radius;

        // calculate distance from rotated circle (0° is on top)
        let radiansAdjusted = Math.atan2(y - this.centerY, x - this.centerX) + Math.PI / 2;
        radiansAdjusted = radiansAdjusted > 0 ? radiansAdjusted : radiansAdjusted + 2 * Math.PI;

        const deg = radiansAdjusted * 180.0 / Math.PI;

        const nextStep = this[_deg2Step](deg);
        if(this.currentStepNo === this.maxSteps && nextStep === 0 ||this.currentStepNo === 0 && nextStep === this.maxSteps) {
            return;
        }

        this.handle.setAttributeNS(null, "cx", this.centerX + newX);
        this.handle.setAttributeNS(null, "cy", this.centerY + newY);

        // TODO: emit event

        this.currentStepNo = nextStep;


        const distance = Math.round(this.radius * radiansAdjusted);
        // add offset
        this.slider.style.strokeDashoffset = this.circumference - distance + "px";
    }

    /**
     * Initializes (calculates values of) all properties and creates a slider.
     */
    [_init]() {
        const container = document.getElementById(this.options.container);

        this.containerOffsetLeft = container.offsetLeft;
        this.containerOffsetTop = container.offsetTop;

        // calculate container's center
        this.centerX = container.offsetWidth / 2;
        this.centerY = container.offsetHeight / 2;
        this.radius = this.options.radius - STROKE_WIDTH; // subtract border width from radius
        this.circumference = this.options.radius * 2 * Math.PI;
        this.currentStepNo = 0;
        this.maxSteps = (this.options.max - this.options.min) / this.options.step;
        this.startMove = false;

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

        container.addEventListener("mousemove", (e) => {
            if (!this.startMove) {
                return;
            }

            console.log("MOVING: " + e.x + ", " + e.y);
            this[_move](e.x, e.y);
        });

        container.addEventListener("mouseup", (e) => {
            console.log("STOP MOVE");
            this.startMove = false;
            //this[valToStep]();
            e.stopPropagation();
        });

        container.addEventListener("mouseleave", (e) => {
            console.log("STOP MOVE");
            this.startMove = false;
            //this[_valToStep]();
            e.stopPropagation();
        });

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
        handle.setAttributeNS(null, "cx", this.centerX);
        handle.setAttributeNS(null, "cy", this.centerY - this.radius);
        handle.setAttributeNS(null, "r", HANDLER_RADIUS);
        handle.setAttributeNS(null, "fill", "#fff");
        handle.setAttributeNS(null, "class", "handle");
        handle.style.stroke = "#CFCFD0";
        handle.style.strokeWidth = "1px";

        handle.addEventListener("mousedown", (e) => {
            console.log("START MOVE");
            this.startMove = true;
            e.stopPropagation();
        });

        return handle;
    }

    [_deg2Val](deg) {
        const range = this.options.max - this.options.min;

        return Math.round(deg * (range / 360.0)) + this.options.min;
    }

    [_deg2Step](deg) {
        const val = this[_deg2Val](deg);
        const stepNo = val / this.options.step;

        return val % this.options.step < this.options.step / 2 ?  stepNo : stepNo + 1;
    }

    [_degToRadius](deg) {
        return deg;
        //return Math.round(Math.PI / 4 - (this.radius * theta));
    }

    [_step2Deg](stepNo) {
        return 180;
    }

    [_valToDeg]() {
        //this.currentValue
    }

    // x,y to degrees
    // degress to radians
    // radians to degrees
    // x,y distance traveled
}