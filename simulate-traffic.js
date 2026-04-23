const http = require('http');

const endpoints = [
  { path: '/fast', delay: 100 },
  { path: '/fast', delay: 200 },
  { path: '/slow', delay: 800 },
  { path: '/error', delay: 300 }
];

async function simulate() {
  console.log("Starting traffic simulation...");
  while (true) {
    for (const endpoint of endpoints) {
      http.get(`http://localhost:3000${endpoint.path}`).on('error', () => {});
      await new Promise(r => setTimeout(r, endpoint.delay));
    }
  }
}

simulate();
