import axios from 'axios';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
export const trackedSymbols = [
  'AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'NFLX', 'CRM', 'ADBE', 'BA'
];

export let latestPrices: Record<string, number> = {};

export async function fetchStockPrices(): Promise<void> {
  try {
    const promises = trackedSymbols.map(async (sym) => {
      const url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_API_KEY}`;
      const response = await axios.get(url);
      latestPrices[sym] = response.data.c ?? 0;
    });
    await Promise.all(promises);
  } catch (err: any) {
    console.error('Finnhub API error:', err.message);
  }
}
