const { EventName, EventStream } = require("casper-js-sdk");
const dotenv = require("dotenv");

dotenv.config();

class CasperStreamer {
  constructor(io) {
    this.io = io;

    console.log(process.env.REACT_APP_EVENT_STREAM_ADDRESS);
    this.es = new EventStream(
      process.env.EVENT_STREAM_ADDRESS ||
        "http://95.217.34.115:9999/events/main"
    );
    console.log(`Created event streamer: ${this.es}`);

    this.es.subscribe(EventName.DeployProcessed, (event) => {
      console.log(`On streamer event`);
      io.emit("data", event);
    });

    this.es.start();
  }
}

module.exports = { CasperStreamer };
