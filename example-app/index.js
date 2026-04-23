const express = require("express");
const { initSuperInspect } = require("../sdk/index.js");

const app = express();
const PORT = 3000;

// 1. Initialize SuperInspect BEFORE other routes
initSuperInspect(app, { serverUrl: "http://localhost:4000" });

// 2. Define routes
app.get("/fast", (req, res) => {
  res.json({ message: "fast" });
});

app.get("/slow", async (req, res) => {
  // Simulate slow response > 500ms
  await new Promise(r => setTimeout(r, 800));
  res.json({ message: "slow" });
});

app.get("/error", (req, res) => {
  res.status(500).json({ error: "Something went wrong" });
});

app.post("/data", (req, res) => {
  res.status(201).json({ message: "Data received" });
});

app.listen(PORT, () => {
  console.log(`[Example App] running on http://localhost:${PORT}`);
  console.log(`Try routes: /fast, /slow, /error`);
});
