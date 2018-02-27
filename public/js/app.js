import CircularSlider from "./CircularSlider";

const options = {
    container: "slider",
    color: "purple",
    max: 1000,
    min: 0,
    step: 1,
    radius: 150
};

const slider = new CircularSlider(options);
const slider2 = new CircularSlider({
    container: "slider", color: "orange", min: 10, max: 20, step: 2, radius: 100, valueChange: (val) => {
        console.log("VALUE CHANGED: " + val);
    }
});


// slider2.on('valueChanged', (e) => {
//     console.log("DELA? " + e.detail);
// });
//slider.currentStep = 100;