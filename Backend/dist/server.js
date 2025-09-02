import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mintRoutes from './routes/mint.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use('/mint', mintRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const server = http.createServer(app);
// Initialize WebSocket server (pass the http server instance)
import startServer from './websocket/server.js';
startServer({ server });
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
