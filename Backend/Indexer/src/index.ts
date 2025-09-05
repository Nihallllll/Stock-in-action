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
    create: { address, status: "Good", lastProcessedBlock: BigInt(blockNumber) },
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
  const eventName = eventType === "Deposit" ? "CollateralDeposited" : "CollateralWithdrawn";
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
          where: { userId_tokenAddress: { userId: user.id, tokenAddress: token } },
          update: { amount: { increment: amount } },
          create: { userId: user.id, tokenAddress: token, amount },
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

// Use recursive timeout to avoid overlapping
const startIndexer = async () => {
  await logic();
  setTimeout(startIndexer, 5000);
};

startIndexer();





// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";
// import { ethers } from "ethers";
// import { ABIS, CONTRACTS } from "../constants/abi.ts";

// dotenv.config();
// const prisma = new PrismaClient();
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// const lendingPool = new ethers.Contract(
//   CONTRACTS.LENDING_POOL,
//   ABIS.LENDING_POOL,
//   provider
// );

// const collateralVault = new ethers.Contract(
//   CONTRACTS.COLLATERAL_VAULT,
//   ABIS.COLLATERAL_VAULT,
//   provider
// );

// const logic = async () => {
//   try {
//     // get last processed block
//     let lastProcessedBlock = await prisma.user.findFirst({
//       orderBy: { lastProcessedBlock: "desc" },
//     });

//     let fromBlock = lastProcessedBlock
//       ? Number(lastProcessedBlock.lastProcessedBlock) + 1
//       : 0;
//     let toBlock = await provider.getBlockNumber();

//     // ---------------- Borrow Events ----------------
//     const borrowLogs = await provider.getLogs({
//       ...lendingPool.filters.Borrowed!(null, null),
//       fromBlock,
//       toBlock,
//     });

//     for (const log of borrowLogs) {
//       const parsed = lendingPool.interface.parseLog(log);
//       const borrower = parsed!.args.borrower;
//       const amount = parsed!.args.amount;

//       await prisma.$transaction([
//         prisma.user.upsert({
//           where: { address: borrower },
//           update: { lastProcessedBlock: BigInt(log.blockNumber) },
//           create: {
//             address: borrower,
//             status: "Good",
//             lastProcessedBlock: BigInt(log.blockNumber),
//           },
//         }),
//         prisma.borrowedToken.upsert({
//           where: { userId_token: { userId: 0, token: "mUSDC" } }, // placeholder
//           update: { amount: { increment: amount } },
//           create: {
//             userId: 0, // will be updated below
//             token: "mUSDC",
//             amount: amount,
//           },
//         }),
//       ]);

//       // Fix upsert userId reference
//       const user = await prisma.user.findUnique({ where: { address: borrower } });
//       if (user) {
//         await prisma.borrowedToken.upsert({
//           where: { userId_token: { userId: user.id, token: "mUSDC" } },
//           update: { amount: { increment: amount } },
//           create: {
//             userId: user.id,
//             token: "mUSDC",
//             amount: amount,
//           },
//         });
//       }
//     }

//     // ---------------- Repay Events ----------------
//     const repayLogs = await provider.getLogs({
//       ...lendingPool.filters.Repaid!(null, null),
//       fromBlock,
//       toBlock,
//     });

//     for (const log of repayLogs) {
//       const parsed = lendingPool.interface.parseLog(log);
//       const borrower = parsed!.args.borrower;
//       const amount = parsed!.args.amount;

//       const user = await prisma.user.upsert({
//         where: { address: borrower },
//         update: { lastProcessedBlock: BigInt(log.blockNumber) },
//         create: {
//           address: borrower,
//           status: "Good",
//           lastProcessedBlock: BigInt(log.blockNumber),
//         },
//       });

//       await prisma.borrowedToken.updateMany({
//         where: { userId: user.id, token: "mUSDC" },
//         data: { amount: { decrement: amount } },
//       });
//     }

//     // ---------------- Deposit Collateral ----------------
//     const depositLogs = await provider.getLogs({
//       ...collateralVault.filters.CollateralDeposited!(null, null, null),
//       fromBlock,
//       toBlock,
//     });

//     for (const log of depositLogs) {
//       const parsed = collateralVault.interface.parseLog(log);
//       const userAddr = parsed!.args.user;
//       const token = parsed!.args.token;
//       const amount = parsed!.args.amount;

//       const user = await prisma.user.upsert({
//         where: { address: userAddr },
//         update: { lastProcessedBlock: BigInt(log.blockNumber) },
//         create: {
//           address: userAddr,
//           status: "Good",
//           lastProcessedBlock: BigInt(log.blockNumber),
//         },
//       });

//       await prisma.depositedToken.upsert({
//         where: { userId_tokenAddress: { userId: user.id, tokenAddress: token } },
//         update: { amount: { increment: amount } },
//         create: {
//           userId: user.id,
//           tokenAddress: token,
//           amount,
//         },
//       });
//     }

//     // ---------------- Withdraw Collateral ----------------
//     const withdrawLogs = await provider.getLogs({
//       ...collateralVault.filters.CollateralWithdrawn!(null, null, null),
//       fromBlock,
//       toBlock,
//     });

//     for (const log of withdrawLogs) {
//       const parsed = collateralVault.interface.parseLog(log);
//       const userAddr = parsed!.args.user;
//       const token = parsed!.args.token;
//       const amount = parsed!.args.amount;

//       const user = await prisma.user.upsert({
//         where: { address: userAddr },
//         update: { lastProcessedBlock: BigInt(log.blockNumber) },
//         create: {
//           address: userAddr,
//           status: "Good",
//           lastProcessedBlock: BigInt(log.blockNumber),
//         },
//       });

//       await prisma.depositedToken.updateMany({
//         where: { userId: user.id, tokenAddress: token },
//         data: { amount: { decrement: amount } },
//       });
//     }
//   } catch (e) {
//     console.error("Indexer error:", e);
//   }
// };

// setInterval(logic, 5000);
