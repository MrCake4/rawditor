import Sliders from "./Sliders.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let image = document.getElementById("sourceImage");

const sliders = new Sliders();

function applyFilter() {
  let redValue = parseInt(sliders.redSlider.value);
  let greenValue = parseInt(sliders.greenSlider.value);
  let blueValue = parseInt(sliders.blueSlider.value);

  let filterString =
    "brightness(" +
    sliders.brightnessSlider.value +
    "%" +
    ") contrast(" +
    sliders.contrastSlider.value +
    "%" +
    ") saturate(" +
    sliders.saturationSlider.value +
    "%" +
    ") invert(" +
    sliders.inversionSlider.value +
    "%" +
    ") sepia(" +
    sliders.sepiaSlider.value +
    "%" +
    ") blur(" +
    sliders.blurSlider.value +
    "px" +
    ") hue-rotate(" +
    sliders.hueSlider.value +
    "deg" +
    ")";

  ctx.filter = filterString;

  ctx.drawImage(image, 0, 0);
  // Get the image data from the canvas
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // Iterate over each pixel and modify its RGB values
  for (let i = 0; i < data.length; i += 4) {
    // Modify the red, green, and blue values of each pixel
    data[i] = clamp(data[i] + redValue); // Red
    data[i + 1] = clamp(data[i + 1] + greenValue); // Green
    data[i + 2] = clamp(data[i + 2] + blueValue); // Blue
    // data[i + 3] is the alpha channel, we leave it unchanged
  }
  ctx.putImageData(imageData, 0, 0);
}

function clamp(value) {
  return Math.min(255, Math.max(0, value));
}

export { applyFilter };
