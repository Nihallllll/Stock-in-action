import { SYNTHETIC_STOCKS } from "../constants/abi";
import oracle from "../services/oracle";
import WebSocket from "ws";
import { fetchStockPrices, trackedSymbols, latestPrices } from "../services/prices";
export default function startServer({ server }) {
    const wss = new WebSocket.Server({ server });
    function broadcastPrices() {
        const stocks = trackedSymbols.map((sym) => ({
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
    async function updateBatchPrices(latestPrices) {
        const addresses = [];
        const prices = [];
        for (const stock of SYNTHETIC_STOCKS) {
            const price = latestPrices[stock.symbol] || 0;
            addresses.push(stock.address);
            prices.push(BigInt(Math.floor(price * 1e8))); // scale to 1e8 if needed
        }
        const tx = await oracle.setPrices(addresses, prices);
        await tx.wait();
    }
    fetchStockPrices();
    setInterval(async () => {
        await fetchStockPrices();
        await updateBatchPrices(latestPrices);
        broadcastPrices();
    }, 10000);
    wss.on("connection", (ws) => {
        console.log("Client connected");
        const initialStocks = trackedSymbols.map((sym) => ({
            symbol: 't' + sym,
            price: latestPrices[sym] || 0,
        }));
        ws.send(JSON.stringify({ type: "price_update", stocks: initialStocks }));
        ws.on("close", () => console.log("Client disconnected"));
        ws.on("error", (err) => console.error("WebSocket error:", err));
    });
}
