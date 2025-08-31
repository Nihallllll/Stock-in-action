const WebSocket = require('ws');
const { fetchStockPrices, trackedSymbols, latestPrices } = require('../services/prices');

module.exports = function(server) {
  const wss = new WebSocket.Server({ server });

  function broadcastPrices() {
    const stocks = trackedSymbols.map(sym => ({
      symbol: 't' + sym,
      price: latestPrices[sym] || 0,
    }));

    const payload = JSON.stringify({
      type: 'price_update',
      stocks,
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  fetchStockPrices();
  setInterval(async () => {
    await fetchStockPrices();
    broadcastPrices();
  }, 10000);

  wss.on('connection', (ws) => {
    console.log('Client connected');
    // Send current prices immediately
    const initialStocks = trackedSymbols.map(sym => ({
      symbol: 't' + sym,
      price: latestPrices[sym] || 0,
    }));
    ws.send(JSON.stringify({ type: 'price_update', stocks: initialStocks }));

    ws.on('close', () => console.log('Client disconnected'));
    ws.on('error', (err) => console.error('WebSocket error:', err));
  });
};
