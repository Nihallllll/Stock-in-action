import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { ABIS, CONTRACTS } from "../constants/abi.ts";

dotenv.config();
const prisma = new PrismaClient();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const lendingPool = new ethers.Contract(
  CONTRACTS.LENDING_POOL,
  ABIS.LENDING_POOL,
  provider
);

const collateralVault = new ethers.Contract(
  CONTRACTS.COLLATERAL_VAULT,
  ABIS.COLLATERAL_VAULT,
  provider
);

// Utility to fetch last processed block globally
const getLastProcessedBlock = async () => {
  const lastUser = await prisma.user.findFirst({
    orderBy: { lastProcessedBlock: "desc" },
  });
  return lastUser ? Number(lastUser.lastProcessedBlock) + 1 : 0;
};

// Generic function to safely upsert user
const upsertUser = async (address: string, blockNumber: number) => {
  return prisma.user.upsert({
    where: { address },
    update: { lastProcessedBlock: BigInt(blockNumber) },
    create: {
      address,
      status: "Good",
      lastProcessedBlock: BigInt(blockNumber),
    },
  });
};

const processBorrowLogs = async (fromBlock: number, toBlock: number) => {
  const borrowLogs = await provider.getLogs({
    ...lendingPool.filters.Borrowed!(null, null),
    fromBlock,
    toBlock,
  });

  for (const log of borrowLogs) {
    try {
      const parsed = lendingPool.interface.parseLog(log);
      const borrower = parsed!.args.borrower;
      const amount = parsed!.args.amount;

      const user = await upsertUser(borrower, log.blockNumber);

      await prisma.borrowedToken.upsert({
        where: { userId_token: { userId: user.id, token: "mUSDC" } },
        update: { amount: { increment: amount } },
        create: { userId: user.id, token: "mUSDC", amount },
      });
    } catch (err) {
      console.error("Borrow log processing error:", err);
    }
  }
};

const processRepayLogs = async (fromBlock: number, toBlock: number) => {
  const repayLogs = await provider.getLogs({
    ...lendingPool.filters.Repaid!(null, null),
    fromBlock,
    toBlock,
  });

  for (const log of repayLogs) {
    try {
      const parsed = lendingPool.interface.parseLog(log);
      const borrower = parsed!.args.borrower;
      const amount = parsed!.args.amount;

      const user = await upsertUser(borrower, log.blockNumber);

      await prisma.borrowedToken.updateMany({
        where: { userId: user.id, token: "mUSDC" },
        data: { amount: { decrement: amount } },
      });
    } catch (err) {
      console.error("Repay log processing error:", err);
    }
  }
};

const processCollateralLogs = async (
  fromBlock: number,
  toBlock: number,
  eventType: "Deposit" | "Withdraw"
) => {
  const eventName =
    eventType === "Deposit" ? "CollateralDeposited" : "CollateralWithdrawn";
  const logs = await provider.getLogs({
    ...collateralVault.filters[eventName]!(null, null, null),
    fromBlock,
    toBlock,
  });

  for (const log of logs) {
    try {
      const parsed = collateralVault.interface.parseLog(log);
      const userAddr = parsed!.args.user;
      const token = parsed!.args.token;
      const amount = parsed!.args.amount;

      const user = await upsertUser(userAddr, log.blockNumber);

      if (eventType === "Deposit") {
        await prisma.depositedToken.upsert({
          where: {
            userId_tokenAddress: { userId: user.id, tokenAddress: token },
          },
          update: { amount: { increment: amount } },
          create: {
            userId: user.id,
            tokenAddress: token,
            amount: amount,
            symbol: parsed!.args.symbol ?? "UNKNOWN", // adjust based on your event
            boughtAt: BigInt(log.blockNumber), // or another source of price/time
          },
        });
      } else {
        await prisma.depositedToken.updateMany({
          where: { userId: user.id, tokenAddress: token },
          data: { amount: { decrement: amount } },
        });
      }
    } catch (err) {
      console.error(`${eventType} log processing error:`, err);
    }
  }
};

const logic = async () => {
  try {
    const fromBlock = await getLastProcessedBlock();
    const toBlock = await provider.getBlockNumber();

    await processBorrowLogs(fromBlock, toBlock);
    await processRepayLogs(fromBlock, toBlock);
    await processCollateralLogs(fromBlock, toBlock, "Deposit");
    await processCollateralLogs(fromBlock, toBlock, "Withdraw");
  } catch (e) {
    console.error("Indexer error:", e);
  }
};


const startIndexer = async () => {
  await logic();
  setTimeout(startIndexer, 5000);
};

startIndexer();

