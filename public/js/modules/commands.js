async function command() {
  const cmdString = document.querySelector("#input-command").value;
  document.querySelector("#input-command").value = ""; // clear

  const res = await fetch("/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serial: sessionStorage.getItem("serial"),
      command: cmdString
    }),
  });
  const data = await res.json();
  console.log(data);
}

async function commandGoto() {
  const waypoint = document.querySelector("#select-goto").value;

  const res = await fetch("/command/goto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serial: sessionStorage.getItem("serial"),
      waypoint: waypoint,
    }),
  });
  const data = await res.json();
  console.log(data);
}

async function commandPanTilt(pan, tilt) {
  const res = await fetch("/command/pan_tilt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serial: sessionStorage.getItem("serial"),
      pan: pan,
      tilt: tilt
    }),
  });
  const data = await res.json();
  console.log(data);
}


export { command, commandGoto, commandPanTilt };
