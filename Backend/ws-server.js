// server.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');
const WebSocket = require('ws');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Replace with your actual ABI + address
const TOKEN_FACTORY_ABI = [ /* ...paste ABI... */ ];
const TOKEN_FACTORY_ADDRESS = "0xCBD432A477ad6C2fCb53391430Cf661147a0A6df";

// Ethereum provider & signer
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenFactory = new ethers.Contract(
  TOKEN_FACTORY_ADDRESS,
  TOKEN_FACTORY_ABI,
  signer
);

// ---------- HTTP ROUTES ---------- //

// Mint endpoint
app.post('/mint', async (req, res) => {
  const { userAddress, symbol, amount } = req.body;
  if (!userAddress || !symbol || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1. Mint on-chain
    const tx = await tokenFactory.mintStockToken(
      symbol,
      userAddress,
      ethers.BigNumber.from(amount)
    );
    await tx.wait();

    // 2. Save in DB
    let user = await prisma.user.findUnique({ where: { address: userAddress } });
    if (!user) {
      user = await prisma.user.create({ data: { address: userAddress } });
    }
    await prisma.mintedToken.create({
      data: {
        userId: user.id,
        symbol,
        amount: BigInt(amount)
      }
    });

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Example health route
app.get('/health', (req, res) => res.json({ status: "ok" }));

// ---------- WEBSOCKET SERVER ---------- //
const server = app.listen(3000, () => {
  console.log("API Server running on http://localhost:3000");
});

const wss = new WebSocket.Server({ server });

let stocks = [
  { symbol: "AAPL", price: 170 },
  { symbol: "TSLA", price: 250 },
  { symbol: "GOOGL", price: 135 },
];

// Broadcast function
function broadcastStocks() {
  const payload = JSON.stringify({
    type: "price_update",
    stocks
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Simulate price changes every 3s
setInterval(() => {
  stocks = stocks.map(s => ({
    ...s,
    price: (s.price + (Math.random() * 4 - 2)).toFixed(2) // random +/- 2
  }));
  broadcastStocks();
}, 3000);
