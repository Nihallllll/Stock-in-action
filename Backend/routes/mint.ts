import express from 'express';
import { depositCollateral, withdrawCollateral } from '../services/blockchain.ts';
import { prisma } from '../services/prisma.ts';
import { Status } from '@prisma/client';

const router = express.Router();

router.post('/depositCol', async (req, res) => {
  const { userAddress, tokenAddress, amount, symbol, boughtAt } = req.body;
  if (!userAddress || !tokenAddress || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const tx = await depositCollateral(tokenAddress, amount);

    let user = await prisma.user.findUnique({ where: { address: userAddress } });
    if (!user) {
      user = await prisma.user.create({ data: { address: userAddress, status: "Good" } });
    }

    await prisma.mintedToken.create({
      data: {
        userId: user.id,
        symbol,
        amount: BigInt(amount),
        boughtAt: BigInt(boughtAt),
        tokenAddress: tokenAddress
      }
    });

    res.json({ success: true, txHash: tx.hash });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Deposit failed' });
  }
});

router.post('/withdraw', async (req, res) => {
  const { userAddress, tokenAddress, amount, symbol, boughtAt } = req.body;
  if (!userAddress || !tokenAddress || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const tx = await withdrawCollateral(tokenAddress, amount);

    let user = await prisma.user.findUnique({ where: { address: userAddress } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    await prisma.mintedToken.updateMany({
      where: { userId: user.id, symbol },
      data: {
        boughtAt: BigInt(boughtAt),
        tokenAddress,
        amount: { decrement: BigInt(amount) }
      }
    });

    res.json({ success: true, txHash: tx.hash });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Withdrawal failed' });
  }
});

export default router;
