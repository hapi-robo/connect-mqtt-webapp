const socketio = require('socket.io');

const mqttClient = require('./mqtt-client');
const Temi = require('./temi');

const temi = new Temi(mqttClient);

const GAIN = 30;

function onKeyboard(data) {
  console.log(data);

  // parse and forward to MQTT
  if ('rotate' in data) {
    temi.rotate(data.serial, GAIN * data.rotate);
  }
  
  if ('translate' in data) {
    temi.translate(data.serial, data.translate);
  }

  if ('tilt' in data) {
    temi.tiltBy(data.serial, GAIN * data.tilt);
  }
}

function onGamepad(data) {
  const obj = JSON.parse(data);

  // parse and forward to MQTT
  if ('translate' in obj) {
    // temi.translate(..., data.translate);
  }

  if ('rotate' in obj) {
    // temi.rotate(..., data.rotate);
  }

  if ('tilt' in obj) {
    // temi.tilt(..., data.tilt);
  }
}

function init(server) {
  const io = socketio(server);

  io.on('connection', socket => {
    console.log(`[${new Date().toLocaleString()}] Socket.IO connection registered...`); 

    // disconnection event
    socket.on('disconnect', () => {
      console.log(`[${new Date().toLocaleString()}] Socket.IO connection de-registered...`);
    });

    // keyboard events
    socket.on('keyboard', data => onKeyboard(data));
    
    // gamepad events
    socket.on('gamepad', data => onGamepad(data));
  });  
}

module.exports = init;
