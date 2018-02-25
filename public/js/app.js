import CircularSlider from "./CircularSlider";

const options = {
    container: "slider",
    color: "purple",
    max: 4,
    min: 0,
    step: 1,
    radius: 150
};

const slider  = new CircularSlider(options);
//slider.currentStep = 100;