// temi MQTT commander class

class Temi {
  constructor(client) {
    this.client = client;
  }

  rotate(id, angle) {
    // Rotate
    console.log(`[CMD] Rotate: ${angle} [deg]`);

    if (angle === 0) {
      // do nothing
    } else {
      const topic = `temi/${id}/command/move/turn_by`;
      const payload = JSON.stringify({ angle: angle });

      this.client.publish(topic, payload, { qos: 0 });
    }
  }

  translate(id, value) {
    // Translate
    console.log(`[CMD] Translate: ${value} [unitless]`);

    if (Math.sign(value) > 0) {
      const topic = `temi/${id}/command/move/forward`;
      this.client.publish(topic, "{}", { qos: 0 });
    } else if (Math.sign(value) < 0) {
      const topic = `temi/${id}/command/move/backward`;
      this.client.publish(topic, "{}", { qos: 0 });
    } else {
      // do nothing
    }
  }

  tilt(id, angle) {
    // Tilt head (absolute angle)
    console.log(`[CMD] Tilt: ${angle} [deg]`);

    if (angle === 0) {
      // do nothing
    } else {
      const topic = `temi/${id}/command/move/tilt`;
      const payload = JSON.stringify({ angle: angle });
      this.client.publish(topic, payload, { qos: 0 });
    }
  }

  tiltBy(id, angle) {
    // Tilt head (relative angle)
    console.log(`[CMD] Tilt By: ${angle} [deg]`);

    if (angle === 0) {
      // do nothing
    } else {
      const topic = `temi/${id}/command/move/tilt_by`;
      const payload = JSON.stringify({ angle: 15 * Math.sign(angle) });
      this.client.publish(topic, payload, { qos: 0 });
    }
  }

  stop(id) {
    // Stop
    console.log("[CMD] Stop");

    const topic = `temi/${id}/command/move/stop`;

    this.client.publish(topic, "{}", { qos: 1 });
  }

  follow(id) {
    // Follow
    console.log(`[CMD] Follow`);

    const topic = `temi/${id}/command/follow/unconstrained`;
    
    this.client.publish(topic, "{}", { qos: 1 });
  }

  goto(id, locationName) {
    // Go to a saved location
    console.log(`[CMD] Go-To: ${locationName}`);

    const topic = `temi/${id}/command/waypoint/goto`;
    const payload = JSON.stringify({ location: locationName });

    this.client.publish(topic, payload, { qos: 1 });
  }

  tts(id, utterance) {
    // Text-to-speech
    console.log(`[CMD] TTS: ${utterance}`);

    const topic = `temi/${id}/command/tts`;
    const payload = JSON.stringify({ utterance: utterance });

    this.client.publish(topic, payload, { qos: 1 });
  }

  video(id, url) {
    // Play video
    console.log(`[CMD] Play Video: ${url}`);

    const topic = `temi/${id}/command/media/video`;
    const payload = JSON.stringify({ url: url });

    this.client.publish(topic, payload, { qos: 1 });
  }

  youtube(id, videoId) {
    // Play YouTube
    console.log(`[CMD] Play YouTube: ${videoId}`);

    const topic = `temi/${id}/command/media/youtube`;
    const payload = JSON.stringify({ video_id: videoId });

    this.client.publish(topic, payload, { qos: 1 });
  }

  webview(id, url) {
    // Play video
    console.log(`[CMD] Show Webview: ${url}`);

    const topic = `temi/${id}/command/media/webview`;
    const payload = JSON.stringify({ url: url });

    this.client.publish(topic, payload, { qos: 1 });
  }

  call(id, roomName) {
    // Start a call
    console.log(`[CMD] Call: ${roomName}`);

    const topic = `temi/${id}/command/call/start`;
    const payload = JSON.stringify({ room_name: roomName });

    this.client.publish(topic, payload, { qos: 1 });
  }

  hangup(id) {
    // End a call
    console.log(`[CMD] Hangup`);

    const topic = `temi/${id}/command/call/end`;

    this.client.publish(topic, "{}", { qos: 1 });
  }

  // https://developer.android.com/reference/android/media/AudioManager#setStreamVolume(int,%20int,%20int)
  // volume(id, volume) {
  //   console.log(`[CMD] Volume: ${volume}`);

  //   const topic = `temi/${id}/command/volume/absolute`;
  //   const payload = JSON.stringify({ volume });

  //   this.client.publish(topic, payload, { qos: 1 });
  // }
}

module.exports = Temi;
