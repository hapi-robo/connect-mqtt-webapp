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
  console.log(`[${new Date().toLocaleString()}] Connected to MQTT broker...`);

  // subscribe to topics
  client.subscribe("temi/+/status/info", { qos: 0 });
});

// event handlers
client.on("reconnect", () => console.log(`[${new Date().toLocaleString()}] Attempting to reconnect...`));
client.on("close", () => console.log(`[${new Date().toLocaleString()}] Disconnected from MQTT broker`));
client.on("error", err =>
  console.log(`[${new Date().toLocaleString()}] Failed to connect to MQTT broker: ${err}`)
);

module.exports = client;
