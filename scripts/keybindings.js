import * as main from "./main.js";

// Keybindings
export default function initKeyBindings() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "i" || event.key === "I") {
      main.invert();
    }
    if (event.key === "s" || event.key === "S") {
      main.saveImage();
    }
    if (event.key === "r" || event.key === "R") {
      main.resetImage();
    }
    if (event.key === "v" || event.key === "V") {
      main.applyVHSFilter();
    }
  });
}
