import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export async function getUserHoldings() {
  // Fetch users with deposits
  const users = await prisma.user.findMany({
    where: {
      deposits: {
        some: {}, // ensures only users who actually have deposits
      },
    },
    select: {
      address: true,
      deposits: {
        select: {
          tokenAddress: true,
          boughtAt: true,
          symbol : true
        },
      },
    },
  });

  
  const userHoldings: { [address: string]: { symbol : string; token: string; boughtPrice: bigint }[] } = {};

  users.forEach((user) => {
    userHoldings[user.address] = user.deposits.map((deposit) => ({
      token: deposit.tokenAddress,
      boughtPrice: deposit.boughtAt,
      symbol : deposit.symbol
    }));
  });

  return userHoldings;
}