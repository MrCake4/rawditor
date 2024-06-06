import Sliders from "./Sliders.js";
import updateVectorscope from "./vectorscope.js";

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

  applyNoise();
  ctx.putImageData(imageData, 0, 0);
}

function clamp(value) {
  return Math.min(255, Math.max(0, value));
}

function invert() {
  switch (inversion) {
    case 0:
      inversion = 100;
      sliders.inversionSlider.value = 100;
      break;
    case 100:
      inversion = 0;
      sliders.inversionSlider.value = 0;
      break;
  }

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
    inversion +
    "%" +
    ") hue-rotate(" +
    sliders.hueSlider.value +
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

function applyNoise() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // Apply noise
  for (let i = 0; i < data.length; i += 4) {
    // Add random noise to each channel
    let noise = Math.random() * sliders.noiseSlider.value; // Adjust noise intensity as needed
    data[i] += noise; // Red
    data[i + 1] += noise; // Green
    data[i + 2] += noise; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}

function imageError() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let ticker = Math.floor(Math.random() * 10);

      let i = (y * canvas.width + x) * 4;

      let rH = data[i];
      let gH = data[i + 1];
      let bH = data[i + 2];

      let rV = data[i];
      let gV = data[i + 1] + Math.random() * 255;
      let bV = data[i + 2];

      if (ticker < 4) {
        data[i] = (rV * rH) / 255;
        data[i + 1] = (gV * gH) / 255;
        data[i + 2] = (bV * bH) / 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
function pixelSort() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  let binaryMask = new Uint8ClampedArray(data.length);
  let sortedMask = new Uint8ClampedArray(data.length);
  let treshhold = document.getElementById("treshholdSlider").value;

  // Create binary mask
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;

      // Pixel pick
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // YUV Conversion
      let Y = 0.299 * r + 0.587 * g + 0.114 * b;

      if (Y < treshhold) {
        binaryMask[i] = 0;
        binaryMask[i + 1] = 0;
        binaryMask[i + 2] = 0;
        binaryMask[i + 3] = 255;
      } else {
        binaryMask[i] = 255;
        binaryMask[i + 1] = 255;
        binaryMask[i + 2] = 255;
        binaryMask[i + 3] = 255;
      }
    }
  }

  // Pixel sort
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    let start = null;

    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      let isEdge = binaryMask[i] === 0;

      // edge detection
      if (isEdge) {
        if (start !== null) {
          let segment = row.slice(start, x);
          segment.sort((a, b) => {
            let Y1 = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
            let Y2 = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
            return Y1 - Y2;
          });

          // Place the sorted segment back into the row
          for (let j = 0; j < segment.length; j++) {
            row[start + j] = segment[j];
          }
          start = null;
        }
      } else {
        if (start === null) start = x;
      }

      row.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      });
    }

    // If there's a remaining segment to sort at the end of the row
    if (start !== null) {
      let segment = row.slice(start, row.length);
      segment.sort((a, b) => {
        let Y1 = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
        let Y2 = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
        return Y1 - Y2;
      });

      for (let j = 0; j < segment.length; j++) {
        row[start + j] = segment[j];
      }
    }

    // rearrange sorted row
    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      sortedMask[i] = row[x].r;
      sortedMask[i + 1] = row[x].g;
      sortedMask[i + 2] = row[x].b;
      sortedMask[i + 3] = row[x].a;
    }
  }

  let sortedImageData = new ImageData(sortedMask, canvas.width, canvas.height);

  ctx.putImageData(sortedImageData, 0, 0);
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

  //inversion = 0;
  applyFilter();
}

function applyTwentiesHorrorFilter() {
  sliders.contrastSlider.value = 120;
  sliders.inversionSlider.value = 0;
  sliders.sepiaSlider.value = 100;
  sliders.greenSlider.value = 5;

  //inversion = 0;
  applyFilter();
}

/* IDEA
  20s horror film filter
  contrast 80
  sepia 100
  greenslider 5
*/

export {
  applyFilter,
  invert,
  applyVHSFilter,
  applyVintageFilter,
  applyNoise,
  pixelSort,
  imageError,
  applyTwentiesHorrorFilter,
};
