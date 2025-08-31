const express = require('express');
const router = express.Router();

const { mintStockToken } = require('../services/blockchain');
const { prisma } = require('../services/prisma');

router.post('/', async (req, res) => {
  const { userAddress, symbol, amount } = req.body;
  if (!userAddress || !symbol || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const tx = await mintStockToken(userAddress, symbol, amount);
    
    let user = await prisma.user.findUnique({ where: { address: userAddress } });
    if (!user) {
      user = await prisma.user.create({ data: { address: userAddress } });
    }
    await prisma.mintedToken.create({
      data: { userId: user.id, symbol, amount: BigInt(amount) }
    });

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Minting failed' });
  }
});

module.exports = router;
