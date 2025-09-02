import { AddressLike } from "ethers";
import { SYNTHETIC_STOCKS } from "../constants/abi.ts";
import oracle from "../services/oracle.ts";

import { fetchStockPrices, trackedSymbols, latestPrices } from "../services/prices.ts";
import { WebSocketServer, WebSocket } from "ws";

export default function startServer(server: any) {
  const wss = new WebSocketServer({ server });



  function broadcastPrices() {
    const stocks = trackedSymbols.map((sym: string) => ({
      symbol: 't' + sym,
      price: latestPrices[sym] || 0,
    }));

    const payload = JSON.stringify({
      type: "price_update",
      stocks,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  // async function updateBatchPrices(latestPrices: Record<string, number>) {
  //   const addresses: AddressLike[] = [];
  //   const prices: bigint[] = [];

  //   for (const stock of SYNTHETIC_STOCKS) {
  //     const price = latestPrices[stock.symbol] || 0;
  //     addresses.push(stock.address as AddressLike);
  //     prices.push(BigInt(Math.floor(price * 1e8))); // scale to 1e8 if needed
  //   }

  //   const tx = await oracle.setPrices(addresses, prices);
  //   await tx.wait();
  // }

  fetchStockPrices();

  setInterval(async () => {
    await fetchStockPrices();
    // await updateBatchPrices(latestPrices);
    broadcastPrices();
  }, 10000);

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    const initialStocks = trackedSymbols.map((sym: string) => ({
      symbol: 't' + sym,
      price: latestPrices[sym] || 0,
    }));

    ws.send(JSON.stringify({ type: "price_update", stocks: initialStocks }));

    wss.on("close", () => console.log("Client disconnected"));
    wss.on("error", (err: Error) => console.error("WebSocket error:", err));
  });
}
