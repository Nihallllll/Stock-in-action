// check.ts
import WebSocket from "ws";
import { getUserHoldings } from "./index.js";
import { PrismaClient } from "@prisma/client";
interface Stock {
  symbol: string;
  price: number;
  prevPrice?: number;
  change24h?: number;
}
const prisma  = new PrismaClient();
const stocks: Stock[] = [];

export async function wsLogic() {
  const ws = new WebSocket("ws://localhost:3000");

  ws.on("open", () => {
    console.log("User connected");
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "price_update" && Array.isArray(data.stocks)) {
        const prevPricesMap = new Map(stocks.map((s) => [s.symbol, s.price]));

        const updatedStocks: Stock[] = data.stocks.map((stock: any) => {
          const prevPrice =
            prevPricesMap.get(stock.symbol) ?? parseFloat(stock.price);
          const price = parseFloat(stock.price);
          const change24h =
            prevPrice === 0 ? 0 : ((price - prevPrice) / prevPrice) * 100;

          return {
            symbol: stock.symbol,
            price,
            prevPrice,
            change24h: parseFloat(change24h.toFixed(2)),
          };
        });

        stocks.splice(0, stocks.length, ...updatedStocks);

        console.log("Updated stocks:", stocks);
      }
    } catch (err) {
      console.error("Invalid WS data:", err);
    }
  });
}

export async function check() {
  const holdings = await getUserHoldings();

  for (const [address, { deposits, debtUSDC }] of Object.entries(holdings)) {
    console.log(address, "debtUSDC:", debtUSDC.toString());

    deposits.forEach((d) => {
      const currentStock = stocks.find((s) => s.symbol === d.symbol);
      if (!currentStock) {
        console.log(`No price for ${d.symbol}`);
        return;
      }

      const calc = (currentStock.price * Number(d.amount)) / Number(debtUSDC);

      prisma.user.update({
        where :{
          address :address
        },
        data :{
          hf: calc
        }
      })

      if(calc < 1) {

      }
    });
  }
}

async function liquidate(address : string ,debt : number , )
