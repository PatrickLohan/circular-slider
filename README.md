# Circular Slider
Javascript Circular Slider

<img src="https://raw.githubusercontent.com/MougLee/circular-slider/master/examples/img/slider.png" alt="Single slider example" width="325" />
<img src="https://raw.githubusercontent.com/MougLee/circular-slider/master/examples/img/sliders.png" alt="Multiple sliders example" width="400" />

## Live Demo

You can see live demo [here](http://e-svet.si/slider)

## Features


* multiple sliders inside one container (see demo image above)
* min/max value with step size specified
    * releasing slider handler before reaching the step value will automatically complete the step
* value change callback reports current value dynamically based on the slider's position
* setting the value by dragging the handler or by tapping the spot on the slider


## Usage

Just add a link to the css file in your `<head>`:

```html
<!-- Add the circular-slider.css styles (load it from lib folder) -->
<link rel="stylesheet" type="text/css" href="https://github.com/MougLee/circular-slider/blob/master/lib/circular-slider.css"/>
```

Then, before your closing ```<body>``` tag add javascript file from the dist folder:

```html
<script type="text/javascript" src="/path/to/dist/circular-slider.min.js"></script>
```

#### Package Managers

You still need to import css files
```html
<link rel="stylesheet" type="text/css" href="https://github.com/MougLee/circular-slider/blob/master/lib/circular-slider.css"/>
```

```sh
# Bower
bower install --save @mougli/circular-slider

# NPM
npm install @mougli/circular-slider
```

Once you install/add the files the files, you can instantiate the slider:

```javascript
const options = {container: 'slider', color: "#5d3b6d", max: 100, min: 0, step: 1, radius: 190, valueChange: val => console.log("Value changed: " + val)};
const slider = new CircularSlider(options);

// read current value
console.log(slider.currentValue);

//set step programmatically
slider.stepNo = 25;
```


### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
container | string | slider | Id of the container div where we want to create a slider.
color | string | green | Progress bar color.
min | integer | 100 | Minimum value that can be set.
max | integer | 0 | Maximal value that can be set.
step | integer | 1 | The minimal step between two values - e.g. min = 0, max = 100, step = 10 - user can move between multiples of 10 between 0 and 100.
radius | integer | 50 | The slider will adjust to the size of the container automatically. Radius 200 means slider will be touching the boundaries.
valueChange | function | undefined | A callback function that is called whenever the slider value changes step. New value is passed in as a parameter.

```javascript
function(newValue) {
    console.log(newValue);
}

// or as lambda function
const valueChange = newVal => console.log(newVal);
```

**Important!** Please note that radius is relative to the container size - 200 is maximum and means 100% of the container. The slider will adjust the to the size of the container automatically. Radius 200 means slider will be touching the boundaries.

## Browser support

Slider is responsive/mobile friendly and works on IE9+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

## License
Copyright (c) 2018 Matic Balantič

Licensed under the MIT license.