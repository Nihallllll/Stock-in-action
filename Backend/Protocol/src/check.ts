import WebSocket from "ws"; // ws client import
import { getUserHoldings } from "./index.js";

interface Stock {
  symbol: string;
  price: number;
  prevPrice?: number;
  change24h?: number;
}
const stocks: Stock[] = [];

async function check() {
  const holdings = getUserHoldings(); // whatever this returns

  const ws = new WebSocket("ws://localhost:3000");

  // Keep track of previous prices

  ws.on("open", () => {
    console.log("User connected");
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "price_update" && Array.isArray(data.stocks)) {
        // Create map for previous prices
        const prevPricesMap = new Map(stocks.map((s) => [s.symbol, s.price]));

        const updatedStocks: Stock[] = data.stocks.map((stock: any) => {
          const prevPrice = prevPricesMap.get(stock.symbol) ?? parseFloat(stock.price);
          const price = parseFloat(stock.price);
          const change24h = prevPrice === 0 ? 0 : ((price - prevPrice) / prevPrice) * 100;

          return {
            symbol: stock.symbol,
            price,
            prevPrice,
            change24h: parseFloat(change24h.toFixed(2)),
          };
        });

        // overwrite local stocks
        stocks.splice(0, stocks.length, ...updatedStocks);

        console.log("Updated stocks:", stocks);
      }
    } catch (err) {
      console.error("Invalid WS data:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("WS error", err);
  });

  ws.on("close", () => {
    console.log("WS connection closed");
  });
}

check();
