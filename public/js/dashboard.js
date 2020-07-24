import { command, commandGoto } from "./modules/commands.js";


// handle keyboard shortcut for sending commands
function keyboardEvent(event) {
  if (event.keyCode === 13) {
    command();
  }
}

// constructs goto dropdown input list
function showWaypointList(waypointList) {
  const inputGoto = document.querySelector("#input-goto");

  inputGoto.innerHTML = ""; // reset content

  const div = document.createElement("div");
  div.className = "input-group";
  div.innerHTML = `
    <div class="input-group-prepend">
      <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
    </div>
    <select class="custom-select" id="select-goto"></select>
    <div class="input-group-append">
      <button class="btn btn-primary" type="button" id="btn-goto">Go</button>
    </div>
    `;

  inputGoto.appendChild(div);
  inputGoto.querySelector("#btn-goto").addEventListener("click", commandGoto);

  const selectGoto = inputGoto.querySelector("#select-goto");

  // construct waypoint list
  const instructionOption = document.createElement("option");
  instructionOption.id = "option-instruction";
  instructionOption.disabled = true;
  instructionOption.selected = true;
  instructionOption.style.display = "none";
  instructionOption.textContent = "Choose a location...";
  selectGoto.appendChild(instructionOption);

  waypointList.forEach(waypointName => {
    const option = document.createElement("option");
    option.id = `option-${waypointName}`;
    option.value = waypointName;
    option.textContent = waypointName;
    selectGoto.appendChild(option);
  });
}

// show battery state
function showBatteryState(value) {
  // @TODO "far fa-battery-bolt"
  const i = document.createElement("i");

  if (value >= 87.5) {
    i.className = "fas fa-battery-full";
  } else if (value >= 62.5 && value < 87.5) {
    i.className = "fas fa-battery-threequarters";
  } else if (value >= 37.5 && value < 62.5) {
    i.className = "fas fa-battery-half";
  } else if (value >= 12.5 && value < 37.5) {
    i.className = "fas fa-battery-quarter";
  } else if (value >= 0 && value < 12.5) {
    i.className = "fas fa-battery-empty";
    i.style.color = "red";
  }

  const deviceBattery = document.querySelector("#device-battery");
  // deviceBattery.appendChild(i);
}

// initialization
async function init() {
  const serial = document.querySelector("#serial").innerHTML;
  sessionStorage.setItem('serial', serial);

  // get device information
  const res = await fetch(`/devices/info?serial=${serial}`, { method: "GET" });
  const dev = await res.json();

  // show battery status
  if (typeof dev.batteryPercentage !== "undefined") {
    showBatteryState(dev.batteryPercentage);
  }

  // show goto list
  if (dev.waypointList.length > 0) {
    showWaypointList(dev.waypointList);
  }
}

// window event listeners
window.onload = init();

// window.onresize = () => {
//   console.log(`innerHeight: ${window.innerHeight}`)
//   console.log(`clientHeight: ${window.document.body.clientHeight}`);
//   console.log(`clientHeight-: ${window.document.body.clientHeight - 200}`);
// };

document.querySelector("#btn-command").addEventListener("click", command);
document.addEventListener("keydown", keyboardEvent);
