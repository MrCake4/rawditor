let vectorScope = document.getElementById("vectorScope");
let vectorScopeCtx = vectorScope.getContext("2d");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function rgbToPolar(r, g, b) {
  let hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
  if (hue < 0) {
    hue += 2 * Math.PI;
  }
  let chroma = Math.sqrt((r - g) ** 2 + (r - b) * (g - b));
  let saturation = chroma / Math.sqrt(r ** 2 + g ** 2 + b ** 2);
  return [hue, saturation];
}

function plotColorOnVectorscope(r, g, b) {
  // Convert RGB to polar coordinates
  let hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
  if (hue < 0) {
    hue += 2 * Math.PI;
  }
  let chroma = Math.sqrt((r - g) ** 2 + (r - b) * (g - b));
  let saturation = chroma / Math.sqrt(r ** 2 + g ** 2 + b ** 2);

  // Adjust the hue angle to fit within the canvas
  let hueAngle = hue * (180 / Math.PI);
  let radius = saturation * (vectorScope.width / 2);

  // Calculate the position on the vectorscope canvas
  let x = radius * Math.cos(hueAngle * (Math.PI / 180)) + vectorScope.width / 2;
  let y =
    radius * Math.sin(hueAngle * (Math.PI / 180)) + vectorScope.height / 2;

  // Draw a point on the vectorscope canvas
  vectorScopeCtx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
  vectorScopeCtx.beginPath();
  vectorScopeCtx.arc(x, y, 3, 0, 2 * Math.PI);
  vectorScopeCtx.fill();
}

// Function to update the vectorscope
export default function updateVectorscope() {
  // Clear the vectorscope canvas
  vectorScopeCtx.clearRect(0, 0, vectorScope.width, vectorScope.height);

  // Get the image data from the canvas
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // Define the downsampling factor
  let downsampleFactor = 4; // Adjust this value as needed for performance

  // Iterate through a subset of pixels and plot their color on the vectorscope
  for (let y = 0; y < canvas.height; y += downsampleFactor) {
    for (let x = 0; x < canvas.width; x += downsampleFactor) {
      let index = (y * canvas.width + x) * 4;
      let r = data[index] / 255;
      let g = data[index + 1] / 255;
      let b = data[index + 2] / 255;

      // Plot color on the vectorscope
      plotColorOnVectorscope(r, g, b);
    }
  }
}

// Call updateVectorscope() whenever you want to update the vectorscope with new image data
