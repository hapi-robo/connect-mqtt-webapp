// parses incoming MQTT messages
const mqttClient = require("./mqtt-client");
const Device = require("./device");

const deviceListAll = [];

function onEventWaypoint(serial, payload) {
  console.log(serial);
  console.log(payload);
}

function onEventUser(serial, payload) {
  console.log(serial);
  console.log(payload);
}

function onStatusInfo(serial, payload) {
  const data = JSON.parse(payload);
  const device = deviceListAll.find(dev => dev.serial === serial);

  if (typeof device === "undefined") {
    // append to list
    console.log("Append device");
    deviceListAll.push(new Device(serial, data));
  } else if (device.timestamp !== data.timestamp) {
    // update parameters
    console.log(`[${new Date().toLocaleString()}] Update device parameters`);
    device.update(data);
  } else {
    // do nothing
  }

  // console.log(deviceListAll);
  // console.log(`List Length: ${deviceListAll.length}`);
}

// message event handler
mqttClient.on("message", (topic, payload) => {
  const topicTree = topic.split("/");
  const serial = topicTree[1];
  const type = topicTree[2];
  const category = topicTree[3];

  switch (type) {
    case "status":
      switch (category) {
        case "info":
          onStatusInfo(serial, payload);
          break;

        case "utils":
          console.log(payload);
          break;

        default:
          break;
      }
      break;

    case "event":
      switch (category) {
        case "waypoint":
          onEventWaypoint(serial, payload);
          break;

        case "user":
          onEventUser(serial, payload);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
});

module.exports = deviceListAll;
