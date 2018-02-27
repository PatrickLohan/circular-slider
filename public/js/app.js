import CircularSlider from "./CircularSlider";

const container = "slider";
const updateVal = (divId, val) => document.getElementById(divId).innerHTML = "$" + val;

const transportation = new CircularSlider({container, color: "#5d3b6d", max: 1000, min: 0, step: 100, radius: 190, valueChange: val => updateVal('transportation', val)});
const food = new CircularSlider({container, color: "#127fc3", min: 10, max: 20, step: 2, radius: 160, valueChange: val => { updateVal('food', val)}});
const insurance = new CircularSlider({container, color: "#22a823", min: 500, max: 20000, step: 100, radius: 130, valueChange: val => updateVal('insurance', val)});
const entertainment = new CircularSlider({container, color: "#fd8123", min: 5, max: 30, step: 5, radius: 100, valueChange: val => updateVal('entertainment', val)});
const healthCare = new CircularSlider({ container, color: "#fd3b3f", min: 0, max: 4, step: 1, radius: 70, valueChange: val => updateVal('health-care', val)});

healthCare.stepNo = 1;
insurance.stepNo = 100;

document.getElementById('transportation').innerHTML = "$" + transportation.currentValue;
document.getElementById('food').innerHTML = "$" + food.currentValue;
document.getElementById('insurance').innerHTML = "$" + insurance.currentValue;
document.getElementById('entertainment').innerHTML = "$" + entertainment.currentValue;
document.getElementById('health-care').innerHTML = "$" + healthCare.currentValue;