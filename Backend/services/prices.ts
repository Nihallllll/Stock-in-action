import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
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

      if (!response.data || typeof response.data.c !== 'number') {
        console.error(`No data for ${sym}:`, response.data);
      } else {
        latestPrices[sym] = response.data.c;
      }
    });
    await Promise.all(promises);
  } catch (err: any) {
    console.error('Finnhub API error:', err.message);
  }
}
