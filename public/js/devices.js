// display devices in a list
function showDeviceList(list) {
  const deviceList = document.querySelector("#list-device");

  // reset list
  deviceList.textContent = "";

  // append each device element
  list.forEach(dev => {
    const a = document.createElement("a");
    a.id = dev.serial;
    a.className =
      "list-group-item list-group-item-action flex-column align-items-start";
    a.innerHTML = `<div class="d-flex w-100 justify-content-between">
                    <h5>${dev.name}</h5>
                    <button id="delete-${dev.serial}" type="button" class="close" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="d-flex w-100 justify-content-between">
                    <small>${dev.serial}</small>
                  </div>`;
    deviceList.appendChild(a);
    document
      .querySelector(`#delete-${dev.serial}`)
      .addEventListener("click", deleteDevice);
  });
}

// get devices from database
async function getDevices() {
  const res = await fetch("/devices/get", { method: "GET" });
  const data = await res.json();
  showDeviceList(data);
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

// initialize device list
async function init() {
  const res = await fetch("/devices/get", { method: "GET" });
  const data = await res.json();
  showDeviceList(data);
}

// window event listeners
window.onload = init();
