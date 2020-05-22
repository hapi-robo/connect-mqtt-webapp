// display devices in a list
function showDeviceList(list) {
  const deviceList = document.querySelector("#list-device");

  // reset list
  deviceList.textContent = "";

  // append each device element
  list.forEach(dev => {
    const a = document.createElement("a");
    a.id = dev.serial;
    a.href=`#`;
    a.className = "list-group-item list-group-item-action";
    a.setAttribute("aria-controls", `${dev.name}`);
    a.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5>${dev.name}</h5>
        <button id="delete-${dev.serial}" type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="d-flex w-100 justify-content-between">
        <small id="small-${dev.serial}">${dev.serial}</small>
      </div>
      `;

    deviceList.appendChild(a);
    document
      .querySelector(`#delete-${dev.serial}`)
      .addEventListener("click", deleteDevice);
  });
}

// update devices in a list
function updateDeviceList(updateList) {
  const container = document.querySelector("#list-device");
  const matches = container.querySelectorAll("a");

  // update each device in the list
  matches.forEach(a => {

    let found = false;
    updateList.forEach(dev => {
      if (dev.serial === a.id) {
        found = true;
      }
    });

    if (found) {
      a.href=`/dashboard/${a.id}`;
      document.querySelector(`#small-${a.id}`).innerHTML = `${a.id}`;
    } else {
      a.href=`#`;
      document.querySelector(`#small-${a.id}`).innerHTML = `${a.id} <span class="text-primary">(Offline)</span>`;
    }
  })
}

// remove device from database
async function deleteDevice(e) {
  const serial = e.target.offsetParent.id;

  const res = await fetch(`/devices/delete?serial=${serial}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (!("exists" in data)) {
    showDeviceList(data);
  }
}

// update device list by polling
async function getDeviceUpdates() {
  const res = await fetch("/devices/update", { method: "GET" });
  const data = await res.json();
  updateDeviceList(data);
}

// initialize device list
async function init() {
  const res = await fetch("/devices/get", { method: "GET" });
  const data = await res.json();
  showDeviceList(data);
  await getDeviceUpdates();

  // poll for device updates
  setInterval(getDeviceUpdates, 5000);
}

// window event listeners
window.onload = init();