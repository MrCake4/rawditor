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
const invertBtn = document.getElementById("completeInversionBtn");
const pixelSortBtn = document.getElementById("pixelSortBtn");
const imgErrorBtn = document.getElementById("imgErrorBtn");
pixelSortBtn.addEventListener("change", filters.pixelSort);

vhsFilterBtn.addEventListener("click", filters.applyVHSFilter);
vintageFilterBtn.addEventListener("click", filters.applyVintageFilter);
pixelSortBtn.addEventListener("click", filters.pixelSort);
showRefrenceBtn.addEventListener("click", showRefrence);
resetImageBtn.addEventListener("click", resetImage);
invertBtn.addEventListener("click", filters.invert);
imgErrorBtn.addEventListener("click", filters.imageError);

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

function updateHueLabelColor() {
  let hueValue = sliders.hueSlider.value;

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
sliders.noiseSlider.addEventListener("input", filters.applyNoise);

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
  sliders.saturationSlider.value = 100;
  sliders.brightnessSlider.value = 100;
  sliders.contrastSlider.value = 100;
  sliders.hueSlider.value = 0;
  sliders.inversionSlider.value = 0;
  sliders.sepiaSlider.value = 0;
  sliders.blurSlider.value = 0;

  sliders.redSlider.value = 0;
  sliders.greenSlider.value = 0;
  sliders.blueSlider.value = 0;

  inversion = 0;

  filters.applyFilter();
  updateHueLabelColor();
}
