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

function invert() {
  switch (inversion) {
    case 0:
      inversion = 100;
      inversionSlider.value = 100;
      break;
    case 100:
      inversion = 0;
      inversionSlider.value = 0;
      break;
  }

  let filterString =
    "brightness(" +
    brightnessSlider.value +
    "%" +
    ") contrast(" +
    contrastSlider.value +
    "%" +
    ") saturate(" +
    saturationSlider.value +
    "%" +
    ") invert(" +
    inversion +
    "%" +
    ") hue-rotate(" +
    hueSlider.value +
    "deg" +
    ")";

  ctx.filter = filterString;

  ctx.drawImage(image, 0, 0);
}

function applyVHSFilter() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // Apply scanlines
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      data[i] = 0; // Set red channel to black
      data[i + 1] = 0; // Set green channel to black
      data[i + 2] = 0; // Set blue channel to black
      data[i + 3] = 100; // Set opacity to control the strength of scanlines
    }
  }

  // Apply color shift
  for (let i = 0; i < data.length; i += 4) {
    // Example: shift red channel to the right
    data[i] = data[i + 4]; // Red
    data[i + 4] = 0; // Set next pixel's red channel to black
  }

  // Apply noise
  for (let i = 0; i < data.length; i += 4) {
    // Add random noise to each channel
    let noise = Math.random() * 50; // Adjust noise intensity as needed
    data[i] += noise; // Red
    data[i + 1] += noise; // Green
    data[i + 2] += noise; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyVintageFilter() {
  sliders.saturationSlider.value = 100;
  sliders.brightnessSlider.value = 100;
  sliders.contrastSlider.value = 100;
  sliders.hueSlider.value = 0;
  sliders.inversionSlider.value = 0;
  sliders.sepiaSlider.value = 100;
  sliders.blurSlider.value = 1;
  sliders.redSlider.value = 10;

  inversion = 0;

  filters.applyFilter();
}

export { applyFilter, invert, applyVHSFilter, applyVintageFilter };
