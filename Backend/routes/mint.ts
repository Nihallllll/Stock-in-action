import express from "express";
import {
  depositCollateral,
  repay,
} from "../services/blockchain.ts";
import { prisma } from "../services/prisma.ts";


const router = express.Router();

router.post("/depositCol", async (req, res) => {
   const { userAddress, tokenAddress, amount } = req.body;
  if (!userAddress || !tokenAddress || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // send tx to chain
    const tx = await depositCollateral(tokenAddress, amount);
    await tx.wait();

    // do NOT write to DB here — indexer will handle it
    res.json({
      success: true,
      message: "Collateral deposit tx sent",
      txHash: tx.hash,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Deposit failed" });
  }
});

router.post("/repay", async (req, res) => {
  const { userAddress, tokenAddress, amount } = req.body;
  if (!userAddress || !tokenAddress || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const tx = await repay(amount);
    await tx.wait();

    res.json({
      success: true,
      message: "Collateral withdraw tx sent",
      txHash: tx.hash,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Withdrawal failed" });
  }
});

export default router;
