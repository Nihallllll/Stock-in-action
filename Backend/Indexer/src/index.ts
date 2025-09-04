import { Prisma, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { ABIS, CONTRACTS } from "../constants/abi.ts";

dotenv.config();
const prisma = new PrismaClient();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const lendingPool = new ethers.Contract(
  CONTRACTS.LENDING_POOL,
  ABIS.LENDING_POOL,
  provider
);

const logic =async () =>{
    
    try{
     let lastProcessedBlock = await prisma.user.findFirst({
        orderBy: {
          lastprocessedblock: 'desc',
        },
     });

     let fromBlock = lastProcessedBlock ?Number(lastProcessedBlock.lastprocessedblock) + 1 : 0;
     let toBlock = await provider.getBlockNumber();
     
     
     const borrowLogs = await provider.getLogs({
        ...lendingPool.filters.Borrowed!( null, null),
        fromBlock,
        toBlock,
     });

     for(let logs of borrowLogs){
        const parsedLog = lendingPool.interface.parseLog(logs);
        const borrower = parsedLog!.args.borrower;
        const amount = parsedLog!.args.amount;

        await prisma.user.upsert({
            where: { address: borrower },
        update: {
          lastprocessedblock: BigInt(logs.blockNumber),
        },
        create: {
          address: borrower,
          status: "Good",
          lastprocessedblock: BigInt(logs.blockNumber),
        },
      });
     }
     

     const repayLogs = await provider.getLogs({
        ...lendingPool.filters.Repaid!( null, null),
        fromBlock,
        toBlock,
     });

     for (const log of repayLogs) {
      const parsed = lendingPool.interface.parseLog(log);
      const borrower = parsed!.args.borrower;
      const amount = parsed!.args.amount;

      console.log("Repay Event:", borrower, amount.toString());

      await prisma.user.upsert({
        where: { address: borrower },
        update: {
          lastprocessedblock: BigInt(log.blockNumber),
        },
        create: {
          address: borrower,
          status: "Good",
          lastprocessedblock: BigInt(log.blockNumber),
        },
      });
    }
     
    }catch(e){
        console.log(e);
    }

    
}
setInterval( logic, 5000);