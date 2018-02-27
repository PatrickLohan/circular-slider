const _validateOptions = Symbol('validateOptions');
const _init = Symbol('init');
const _createRootSVG = Symbol('createRootSVG');
const _initSlider = Symbol("addSliderToRootSVG");
const _createSliderCircle = Symbol('createSliderCircle');
const _createEmptyCircle = Symbol('createEmptyCircle');
const _createCircle = Symbol('createSlider');
const _createHandle = Symbol('createHandle');
const _deg2Step = Symbol('deg2Step');
const _step2Rad = Symbol('step2Rad');
const _val2Step = Symbol('_val2Step');
const _deg2Val = Symbol('deg2Val');
const _move = Symbol('move');
const _canMove = Symbol('cantMove');
const _cancelDrag = Symbol('cancelDrag');
const _handleDrag = Symbol('handleDrag');
const _handleSliderClick = Symbol('handleSlideClick');
const _calculateNewPosition = Symbol('calculateNewPoint');
const _transformClientToLocalCoordinate = Symbol('transformClientToLocalCoordinate');

const STROKE_WIDTH = 20;
const HANDLER_RADIUS = (STROKE_WIDTH / 2) + 2;
const TOLERANCE = 60;

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

        this[_validateOptions]();
        this[_init]();
    }

    /**
     * Returns the current value which can only be a number divisible by step.
     *
     * @returns {number}
     */
    get currentValue() {
        return this.options.min + (this.currentStepNo * this.options.step)
    }

    /**
     * Sets slider value based on the provided step number. We don't allow setting the value directly since
     * it can only be set to numbers divisible by step (this.options.step).
     *
     * @param stepNo
     */
    set stepNo(stepNo) {
        const maxSteps = (this.options.max - this.options.min) / this.options.step;
        if (isNaN(parseFloat(stepNo)) || stepNo < 0 || stepNo > maxSteps) {
            throw new Error("Step number " + stepNo + " is not between 0 and " + maxSteps);
        }

        const radiansStart = this.position.radians;
        const radiansEnd = this[_step2Rad](stepNo);
        const path = Math.abs(radiansStart - radiansEnd) * 50;
        const isIncreasing = radiansStart < radiansEnd;

        let radiansMove = radiansStart;
        const intervalId = setInterval(() => {
            if ((isIncreasing && radiansMove >= radiansEnd) || (!isIncreasing && radiansMove <= radiansEnd
                    || (this.isMoving && this.stopMove))) {
                clearInterval(intervalId);
                this.stopMove = false;
                this.isMoving = false;
                return;
            }

            radiansMove += isIncreasing ? 0.01 : -0.01;
            const x = Math.round(Math.sin(radiansMove) * this.radius);
            const y = Math.round(Math.cos(radiansMove) * this.radius) * -1;

            this[_move](x, y);
        }, path / (this.radius * 100)) // go faster if path is longer
    }

    /**
     * Moves slider on the orbit for the given coordinates.
     *
     * @param x
     * @param y
     */
    [_move](x, y) {
        const newPosition = this[_calculateNewPosition](x, y);
        if (!this[_canMove](newPosition)) {
            return;
        }

        const nextStep = this[_deg2Step](newPosition.degrees);

        // notify about value change
        if (this.currentStepNo !== nextStep && (this.options.valueChange && typeof(this.options.valueChange) === 'function')) {
            this.currentStepNo = nextStep; // set step here so we send the latest value
            this.options.valueChange(this.currentValue);
        }

        // update slider internal state
        this.value = this[_deg2Val](newPosition.degrees);
        this.currentStepNo = nextStep;
        this.position = newPosition;

        // move handler and add offset to color the slider according to its value
        this.handle.setAttributeNS(null, "cx", this.centerX + newPosition.x);
        this.handle.setAttributeNS(null, "cy", this.centerY + newPosition.y);
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

    [_validateOptions]() {
        const step = this.options.step;
        const min = this.options.min;
        const max = this.options.max;

        if(min > max) {
            throw new Error("Min " + min + " must be smaller than max " + max + "!");
        }

        if(max % step !== 0 || min % step !== 0) {
            throw new Error("Min " + min + " and max " + max + " + must be divisible by step " + step + "!");
        }
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
        this.startDrag = false;
        this.position = this[_calculateNewPosition](this.centerX, this.centerY - this.radius);
        this.value = this.options.min;

        this.stopMove = false;
        this.isMoving = true;

        this[_initSlider]();
    }

    /**
     * Creates slider composed of underlying stripped SVG circle and top colored circle which will behave as slider.
     */
    [_initSlider]() {
        const container = document.getElementById(this.options.container);

        // create root svg only when the first slider is added to the container.
        this.rootSVG = document.getElementById("sliderRootSVG");
        if (this.rootSVG === null) {
            this.rootSVG = this[_createRootSVG](container.offsetWidth, container.offsetHeight);
            container.appendChild(this.rootSVG);
        }

        const svgPoint = this.rootSVG.createSVGPoint();
        container.addEventListener("mousemove", e => this[_handleDrag](e, svgPoint));
        container.addEventListener("mouseup", e => this[_cancelDrag](e));
        container.addEventListener("mouseleave", e => this[_cancelDrag](e));

        this.slider = this[_createSliderCircle]();
        this.handle = this[_createHandle]();

        this.rootSVG.appendChild(this[_createEmptyCircle](svgPoint, ));
        this.rootSVG.appendChild(this.slider);
        this.rootSVG.appendChild(this.handle);
    }

    /**
     * Handles drag as long as the touch/mouse is inside the tolerance radius.
     * @param e
     * @param svgPoint
     */
    [_handleDrag](e, svgPoint) {
        if (!this.startDrag) {
            return;
        }

        const localCoords = this[_transformClientToLocalCoordinate](svgPoint, e);
        const mouseHandleOffsetX = this.handle.getAttribute("cx") - localCoords.x;
        const mouseHandleOffsetY = this.handle.getAttribute("cy") - localCoords.y;
        if (mouseHandleOffsetX > TOLERANCE || mouseHandleOffsetY > TOLERANCE) {
            this.startDrag = false;
        } else {
            this[_move](localCoords.x, localCoords.y);
        }

        e.stopPropagation();
        e.preventDefault();
    }


    /**
     * Cancels drag and finishes the move by scrolling to the closest step.
     *
     * @param e
     */
    [_cancelDrag](e) {
        // only complete step if you are currently moving
        if (this.startDrag) {
            this.stepNo = this[_val2Step](this.value);
        }

        this.startDrag = false;
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Creates root svg to which all sliders residing in the same container are later appended.
     * @returns {SVGCircleElement}
     */
    [_createRootSVG](containerWidth, containerHeight) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const minX = -1 * containerWidth / 2;
        const minY = -1 * containerHeight / 2;
        const viewBox = minX + " " + minY + " " + containerWidth + " " + containerHeight;

        svg.setAttributeNS(null, "id", "sliderRootSVG");
        svg.setAttributeNS(null, "viewBox", viewBox);

        return svg;
    }

    [_transformClientToLocalCoordinate](svgPoint, event) {
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;

        return svgPoint.matrixTransform(this.rootSVG.getScreenCTM().inverse());
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

        slider.addEventListener('click', e => this[_handleSliderClick](e));

        return slider;
    }

    /**
     * Creates new SVG circle used as empty "underlying" slider.
     */
    [_createEmptyCircle]() {
        const slider = this[_createCircle]();

        slider.setAttributeNS(null, 'class', 'dashed-circle');
        slider.addEventListener('click', e => this[_handleSliderClick](e));
        slider.style.strokeWidth = STROKE_WIDTH + "px";
        slider.style.strokeDasharray = "5, 3";

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
            this.startDrag = true;
            e.stopPropagation();
            e.preventDefault();
        });

        return handle;
    }

    [_handleSliderClick](e) {
        this.stopMove = false;
        this.isMoving = true;
        const svgPoint = this.rootSVG.createSVGPoint();
        const localCoords = this[_transformClientToLocalCoordinate](svgPoint, e);
        const newPosition = this[_calculateNewPosition](localCoords.x, localCoords.y);
        this.stepNo = this[_deg2Step](newPosition.degrees);
    }

    [_deg2Step](deg) {
        const val = this[_deg2Val](deg);

        return this[_val2Step](val);
    }

    [_deg2Val](deg) {
        const range = this.options.max - this.options.min;

        return Math.round(deg * (range / 360.0)) + this.options.min;
    }

    [_val2Step](val) {
        return Math.round((val - this.options.min) / this.options.step)
    }

    [_step2Rad](stepNo) {
        const val = stepNo * this.options.step + this.options.min
        const adjustedVal = val - this.options.min;
        const range = this.options.max - this.options.min;
        const degrees = this.options.max === val ? 359.99 : (Math.round(adjustedVal * (360.0 / range))) % 360;

        return degrees * Math.PI / 180;
    }
}