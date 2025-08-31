require('dotenv').config();
const express = require('express');
const http = require('http');

const app = express();
app.use(express.json());

const mintRoutes = require('./routes/mint');
app.use('/mint', mintRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);

// Initialize WebSocket server (pass the http server instance)
require('./websocket/server')(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
