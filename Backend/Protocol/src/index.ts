// services/holdings.ts
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { check, wsLogic } from "./check.js";

dotenv.config();
const prisma = new PrismaClient();

type DepositRecord = {
  symbol: string;
  tokenAddress: string;
  boughtAt: bigint;
  amount: bigint;
};

type UserHolding = {
  deposits: DepositRecord[];
  debtUSDC: bigint; // total debt in USDC (raw units as stored in DB)
};

export async function getUserHoldings(): Promise<Record<string, UserHolding>> {
  const users = await prisma.user.findMany({
    where: {
      deposits: { some: {} }, // only users who have deposits
    },
    select: {
      address: true,
      deposits: {
        select: {
          tokenAddress: true,
          boughtAt: true,
          symbol: true,
          amount: true,
        },
      },
      borrows: {
        select: {
          token: true,
          amount: true,
        },
      },
    },
  });

  const toBigInt = (v: any): bigint => (typeof v === "bigint" ? v : BigInt(v ?? 0));

  const result: Record<string, UserHolding> = {};

  for (const user of users) {
    const deposits: DepositRecord[] = (user.deposits || []).map((d) => ({
      symbol: d.symbol,
      tokenAddress: d.tokenAddress,
      boughtAt: toBigInt(d.boughtAt),
      amount: toBigInt(d.amount),
    }));

    // Sum only USDC borrows. Adjust this filter if you store token addresses.
    const debtUSDC = (user.borrows || []).reduce((acc: bigint, b: any) => {
      const tokenName = (b?.token ?? "").toString().toLowerCase();
      if (tokenName.includes("usdc")) {
        return acc + toBigInt(b.amount);
      }
      return acc;
    }, BigInt(0));

    result[user.address] = { deposits, debtUSDC };
  }

  return result;
}

async function main() {
  wsLogic(); // start WebSocket
  setInterval(async () => {
    await check(); // run every 5 seconds
  }, 5000);
}

main().catch((err) => {
  console.error("Error in main:", err);
  process.exit(1);
});