import { commandPanTilt } from "./modules/commands.js";

function singleClick(event) {
  const serial = sessionStorage.getItem("serial");

  // width and height of the target node
  clickArea = document.querySelector("#div-video");
  const width = clickArea.offsetWidth;
  const height = clickArea.offsetHeight;
  
  // mouse pointer relative to the position of the padding edge of the target node
  const clickX = event.offsetX;
  const clickY = event.offsetY;

  // distance from center
  const deltaX = clickX - (width / 2);
  const deltaY = clickY - (height / 2);
  const pan = deltaX / (width / 2); // [%]
  const tilt = deltaY / (height / 2); // [%]

  commandPanTilt(pan, tilt);
}

document.querySelector("#div-video").addEventListener("click", singleClick);
