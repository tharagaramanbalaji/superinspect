const { io } = require("socket.io-client");

function initSuperInspect(app, options = {}) {
  const serverUrl = options.serverUrl || "http://localhost:4000";
  const socket = io(serverUrl);

  socket.on("connect", () => {
    console.log(`[SuperInspect] Connected to server at ${serverUrl}`);
  });

  socket.on("connect_error", (err) => {
    console.error(`[SuperInspect] Connection error: ${err.message}`);
  });

  // Middleware function
  app.use((req, res, next) => {
    const start = Date.now();
    const route = req.originalUrl || req.url;
    const method = req.method;

    res.on("finish", () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      socket.emit("api_request", {
        id: Math.random().toString(36).substring(2, 9),
        route,
        method,
        duration,
        statusCode,
        timestamp: new Date().toISOString()
      });
    });

    next();
  });
}

module.exports = { initSuperInspect };
