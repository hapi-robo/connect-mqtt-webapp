// https://github.com/mqttjs/MQTT.js
const mqtt = require("mqtt");

let client;
if (process.env.NODE_ENV !== 'production') {
  client = mqtt.connect("mqtt://localhost");
} else {
  const keys = require('../config/keys');
  client = mqtt.connect(keys.mqtt.hostname, {
    username: keys.mqtt.username,
    password: keys.mqtt.password
  });
}

// successful connection
client.on("connect", () => {
  console.log("Connected to MQTT broker...");

  // subscribe to topics
  client.subscribe("temi/+/status/info", { qos: 0 });
});

// event handlers
client.on("reconnect", () => console.log(`Attempting to reconnect...`));
client.on("close", () => console.log(`Disconnected to MQTT broker`));
client.on("error", err =>
  console.log(`Failed to connect to MQTT broker: ${err}`)
);

module.exports = client;
