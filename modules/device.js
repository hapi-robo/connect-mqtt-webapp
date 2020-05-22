function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

class Device {
  // constructor
  constructor(serial, obj = {}) {
    // identification
    this.serial = serial;

    // reset parameters
    this.reset();

    // update parameters
    this.update(obj);
  }

  // update parameters
  update(obj) {
    // state
    if (obj.state) {
      this.state = obj.state;
    }
    if (obj.battery_percentage) {
      this.batteryPercentage = obj.battery_percentage;
    }

    // navigation
    if (obj.destination) {
      this.destination = obj.destination;
    }
    if (obj.waypoint_list) {
      this.waypointList = obj.waypoint_list;
    }

    // timestamp
    if (obj.timestamp) {
      this.ts = obj.timestamp;
    }
  }

  // reset parameters
  reset() {
    // state
    this.state = undefined;
    this.batteryPercentage = undefined;

    // navigation
    this.destination = undefined;
    this.waypointList = [];

    this.ts = undefined;
  }

  get timestamp() {
    return this.ts;
  }

  set timestamp(timestamp) {
    this.ts = timestamp;
  }
}

module.exports = Device;
