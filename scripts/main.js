import initKeyBindings from "./keybindings.js";
import Sliders from "./Sliders.js";
import * as filters from "./filters.js";

let image = document.getElementById("sourceImage");
/*
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");*/

const sliders = new Sliders();

let hueLabel = document.getElementById("hueLabel");

let fileUpload = document.getElementById("file");

const vhsFilterBtn = document.getElementById("vhsFilterBtn");
const vintageFilterBtn = document.getElementById("vintageFilterBtn");
const showRefrenceBtn = document.getElementById("refrence");
const resetImageBtn = document.getElementById("resetImageBtn");

vhsFilterBtn.addEventListener("click", applyVHSFilter);
vintageFilterBtn.addEventListener("click", applyVintageFilter);
showRefrenceBtn.addEventListener("click", showRefrence);
resetImageBtn.addEventListener("click", resetImage);

let imageUpload = false;
let inversion = 0;
let refrence = false;

initKeyBindings();

function uploadImage(event) {
  image.src = URL.createObjectURL(event.target.files[0]);

  image.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.crossOrigin = "anonymous";
    imageUpload = true;
    document.getElementById("status-container").style.display = "none";
    filters.applyFilter();
  };
}

export function invert() {
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

export function applyVHSFilter() {
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

function updateHueLabelColor() {
  let hueValue = hueSlider.value;

  hueLabel.style.color = `hsl(${hueValue}, 100%, 50%)`;

  if (hueValue === "0") {
    hueLabel.style.color = "white";
  }
  hueLabel.textContent = `HUE`;
}

function showRefrence() {
  if (!refrence) {
    document.getElementById("sourceImage").style.display = "block";
    refrence = true;
  } else {
    document.getElementById("sourceImage").style.display = "none";
    refrence = false;
  }
}

sliders.brightnessSlider.addEventListener("input", filters.applyFilter);
sliders.contrastSlider.addEventListener("input", filters.applyFilter);
sliders.saturationSlider.addEventListener("input", filters.applyFilter);
sliders.inversionSlider.addEventListener("input", filters.applyFilter);
sliders.sepiaSlider.addEventListener("input", filters.applyFilter);
sliders.blurSlider.addEventListener("input", filters.applyFilter);
sliders.hueSlider.addEventListener("input", function () {
  filters.applyFilter();
  updateHueLabelColor();
});
sliders.redSlider.addEventListener("input", filters.applyFilter);
sliders.greenSlider.addEventListener("input", filters.applyFilter);
sliders.blueSlider.addEventListener("input", filters.applyFilter);

export function saveImage() {
  if (!imageUpload) {
    return;
  }
  let linkElement = document.getElementById("link");
  linkElement.setAttribute("download", "RAWDITOR_edited_image.png");

  let canvasData = canvas.toDataURL("image/png");

  canvasData.replace("image/png", "image/octet-stream");

  linkElement.setAttribute("href", canvasData);

  linkElement.click();
}

/*canvas.addEventListener("wheel", zoom);*/
fileUpload.addEventListener("change", uploadImage);

export function resetImage() {
  if (!imageUpload) {
    return;
  }
  saturationSlider.value = 100;
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  hueSlider.value = 0;
  inversionSlider.value = 0;
  sepiaSlider.value = 0;
  blurSlider.value = 0;

  redSlider.value = 0;
  greenSlider.value = 0;
  blueSlider.value = 0;

  inversion = 0;

  filters.applyFilter();
  updateHueLabelColor();
}
