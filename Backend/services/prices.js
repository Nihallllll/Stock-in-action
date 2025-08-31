const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const trackedSymbols = [
  'AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN',
  'NVDA', 'NFLX', 'CRM', 'ADBE', 'BA',
];

let latestPrices = {};

async function fetchStockPrices() {
  try {
    const promises = trackedSymbols.map(async (sym) => {
      const url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_API_KEY}`;
      const response = await axios.get(url);
      latestPrices[sym] = response.data.c || 0;
    });
    await Promise.all(promises);
  } catch (err) {
    console.error('Finnhub API error:', err.message);
  }
}

module.exports = {
  fetchStockPrices,
  trackedSymbols,
  latestPrices,
};
