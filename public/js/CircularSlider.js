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
const _deg2Val = Symbol('deg2Val');
const _move = Symbol('move');
const _canMove = Symbol('cantMove');
const _isMovingClockwise = Symbol('isMovingClockwise');
const _calculateNewPosition = Symbol('calculateNewPoint');
const _transformClientToLocalCoordinate = Symbol('transformClientToLocalCoordinate');

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
        const newPosition = this[_calculateNewPosition](x, y);

        if (!this[_canMove](newPosition)) {
            return;
        }

        this.handle.setAttributeNS(null, "cx", this.centerX + newPosition.x);
        this.handle.setAttributeNS(null, "cy", this.centerY + newPosition.y);

        const nextStep = this[_deg2Step](newPosition.degrees);
        if (this.currentStepNo !== nextStep && (this.options.valueChange && typeof(this.options.valueChange) === 'function')) {
            this.currentStepNo = nextStep;
            this.options.valueChange(this.currentValue);
        }

        this.currentStepNo = nextStep;
        this.position = newPosition;

        // add offset to color the slider according to its value
        this.slider.style.strokeDashoffset = this.circumference - newPosition.path + "px";
    }

    /**
     * Returns false if slider wants to be moved past the top zero point.
     *
     * @param newPosition
     * @returns {boolean}
     */
    [_canMove](newPosition) {
        return !(this.position.y < 0 && ((this.position.x >= 0 && newPosition.x < 0) || (this.position.x < 0 && newPosition.x >= 0)));
    }

    /**
     * Calculates new position, angles and path traveled based on local coordinate system (center = 0,0).
     *
     * @param x
     * @param y
     * @returns {{x: number, y: number, degrees: number, radians: number, path: number}}
     */
    [_calculateNewPosition](x, y) {
        // calculate distance from rotated circle (0° is on top)
        // replacing x and y in Math.atan2 method rotates the axis for 90 degrees but in wrong direction
        // multiply Y with -1 to "rotate" for 180° in the right direction :)
        const angelRadians = Math.atan2(x - this.centerX, -y - this.centerY);
        const newX = Math.round(Math.sin(angelRadians) * this.radius);
        const newY = Math.round(Math.cos(angelRadians) * this.radius) * -1;

        // we have our coordinates right, but angles need to be adjusted to positive number
        // basically just add 2PI - 360 degrees
        const radians360 = angelRadians < 0 ? angelRadians + 2 * Math.PI : angelRadians;
        const angelDegrees = radians360 * 180.0 / Math.PI;
        const path = Math.round(this.radius * radians360);

        return {x: newX, y: newY, degrees: angelDegrees, radians: radians360, path: path};
    }

    /**
     * Initializes (calculates values of) all properties and creates a slider.
     */
    [_init]() {
        this.centerX = 0;
        this.centerY = 0;
        this.radius = this.options.radius - STROKE_WIDTH; // subtract border width from radius
        this.circumference = this.options.radius * 2 * Math.PI;
        this.currentStepNo = 0;
        this.maxSteps = (this.options.max - this.options.min) / this.options.step;
        this.startMove = false;
        this.position = this[_calculateNewPosition](this.centerX, this.centerY - this.radius);

        this[_initSlider]();
    }



    /**
     * Creates slider composed of underlying stripped SVG circle and top colored circle which will behave as slider.
     */
    [_initSlider]() {
        const container = document.getElementById(this.options.container);
        console.log(container.offsetWidth);

        // create root svg only when the first slider is added to the container.
        let rootSVG = document.getElementById("sliderRootSVG");
        if (rootSVG === null) {
            rootSVG = this[_createRootSVG](container.offsetWidth, container.offsetHeight);
            container.appendChild(rootSVG);
        }

        const handle = this.handle;
        const svgPoint = rootSVG.createSVGPoint();
        let localCoords;
        container.addEventListener("mousemove", (e) => {
            if (!this.startMove) {
                return;
            } else if (this.handle.getAttribute("cx") - e.x > 60 || this.handle.getAttribute("cy") - e.y > 60) {
                this.startMove = false;
                //console.log("STOPPING MOVE, TOO FAR");
                return;
            }

            localCoords = this[_transformClientToLocalCoordinate](svgPoint, e, localCoords, rootSVG);
            //console.log("MOVING: " + e.x + ", " + e.y);
            this[_move](localCoords.x, localCoords.y);
        });

        container.addEventListener("mouseup", (e) => {
            //console.log("STOP MOVE");
            this.startMove = false;
            //this[valToStep]();
            e.stopPropagation();
        });

        container.addEventListener("mouseleave", (e) => {
            // console.log("STOP MOVE");
            this.startMove = false;
            //this[_valToStep]();
            e.stopPropagation();
        });

        this.slider = this[_createSliderCircle]();
        this.handle = this[_createHandle]();

        rootSVG.appendChild(this[_createEmptyCircle]());
        rootSVG.appendChild(this.slider);
        rootSVG.appendChild(this.handle);
    }

    /**
     * Creates root svg to which all sliders residing in the same container are later appended.
     * @returns {SVGCircleElement}
     */
    [_createRootSVG](containerWidth, containerHeight) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const minX = -1 * containerWidth/2;
        const minY = -1 * containerHeight/2;
        const viewBox = minX + " " + minY + " " + containerWidth + " " + containerHeight;
        console.log(viewBox);

        svg.setAttributeNS(null, "id", "sliderRootSVG");
        svg.setAttributeNS(null, "height", "100%");
        svg.setAttributeNS(null, "width", "100%");
        svg.setAttributeNS(null, "viewBox", viewBox);

        return svg;
    }

    [_transformClientToLocalCoordinate](svgPoint, event, localCoords, rootSVG) {
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;

        return svgPoint.matrixTransform(rootSVG.getScreenCTM().inverse());
    }

    /**
     * Creates new SVG circle used as a top slider.
     */
    [_createSliderCircle]() {
        const slider = this[_createCircle]();

        //slider.setAttributeNS(null, 'rotate', '-90deg');
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
        handle.setAttributeNS(null, "cx", `${this.centerX}`);
        handle.setAttributeNS(null, "cy", `${this.centerY - this.radius}`);
        handle.setAttributeNS(null, "r", `${HANDLER_RADIUS}`);
        handle.setAttributeNS(null, "fill", "#fff");
        handle.setAttributeNS(null, "class", "handle");
        handle.setAttributeNS(null, "id", "handle" + this.options.container + this.radius); // add uniqueId
        handle.style.stroke = "#CFCFD0";
        handle.style.strokeWidth = "1px";

        handle.addEventListener("mousedown", (e) => {
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

        return Math.round((val - this.options.min) / this.options.step);
    }

    [_step2Deg](stepNo) {
        return 180;
    }

    [_valToDeg]() {
        //this.currentValue
    }

    [_isMovingClockwise](x, y) {
        // if in top half x must be < than new X and x > newX if in the bottom half.
        return (this.position.y <= 0 && this.position.x <= x) || (this.position.y > 0 && this.position.x >= x);
    }

    // x,y to degrees
    // degress to radians
    // radians to degrees
    // x,y distance traveled
}