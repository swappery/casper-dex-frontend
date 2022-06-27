const express = require("express");
const request = require("request");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { CasperStreamer } = require("./casperStreamer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use("/api/cors", function (req, res, next) {
  const { query } = req;

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    // CORS Preflight
    res.send();
  } else {
    const targetURL = query.url; // Target-URL ie. https://example.com or http://example.com

    if (!targetURL) {
      res.status(500).send({
        error: "There is no Target-Endpoint header in the request",
      });
      return;
    }
    request(
      {
        body: req.body,
        url: targetURL,
        method: req.method,
        json: req.body,
        headers: { Authorization: req.header("Authorization") },
      },
      function (error, response, body) {
        if (error) {
          console.error("error: " + error);
        }
      }
    ).pipe(res);
  }
});

app.use(express.static(path.resolve(__dirname, "../build")));
app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});

const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

const casperStreamer = new CasperStreamer(io);
