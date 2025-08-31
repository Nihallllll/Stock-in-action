const { ethers } = require('ethers');

const TOKEN_FACTORY_ABI = [ /* Paste ABI here */ ];
const TOKEN_FACTORY_ADDRESS = process.env.TOKEN_FACTORY_ADDRESS;

const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenFactory = new ethers.Contract(
  TOKEN_FACTORY_ADDRESS,
  TOKEN_FACTORY_ABI,
  signer
);

async function mintStockToken(toAddress, symbol, amount) {
  const tx = await tokenFactory.mintStockToken(
    symbol,
    toAddress,
    ethers.BigNumber.from(amount)
  );
  await tx.wait();
  return tx;
}

module.exports = {
  mintStockToken,
};
