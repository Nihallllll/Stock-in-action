import { ethers } from "ethers";
import { CONTRACTS, ABIS } from "../constants/abi.ts";

const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

// Await signer properly inside async function (no top-level await)
async function getSigner() {
  return provider.getSigner();
}

function getContract(
  address: string,
  abi: any,
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

let oracle: ethers.Contract;
let collateral: ethers.Contract;
let customToken: ethers.Contract;
let lendingPool: ethers.Contract;

// Initialization function to asynchronously get signer and contracts
export async function initContracts() {
  const signer = await getSigner();

  oracle = getContract(CONTRACTS.ORACLE, ABIS.ORACLE, signer);
  collateral = getContract(CONTRACTS.COLLATERAL_VAULT, ABIS.COLLATERAL_VAULT, signer);
  customToken = getContract(CONTRACTS.COLLATERAL_VAULT, ABIS.CUSTOM_TOKEN, signer);
  lendingPool = getContract(CONTRACTS.LENDING_POOL, ABIS.LENDING_POOL, signer);
}

export async function depositCollateral(tokenAddress: string, amount: string | number | bigint) {
  if (!customToken || !collateral) await initContracts();

  const tx0 = await customToken.approve(CONTRACTS.LENDING_POOL, BigInt(amount));
  await tx0.wait();

  const tx = await collateral.depositCollateral(tokenAddress, BigInt(amount));
  await tx.wait();

  return tx;
}

export async function withdrawCollateral(tokenAddress: string, amount: string | number | bigint) {
  if (!collateral) await initContracts();

  const tx = await collateral.withdrawCollateral(tokenAddress, BigInt(amount));
  await tx.wait();

  return tx;
}

export async function borrowmUSDC(amount: string | number | bigint) {
  if (!lendingPool) await initContracts();

  const tx = await lendingPool.borrow(BigInt(amount));
  await tx.wait();

  return tx;
}

export async function updatePrice(addresses: string[], amounts: bigint[]) {
  if (!oracle) await initContracts();

  const tx = await oracle.setPrices(addresses, amounts);
  await tx.wait();

  return tx;
}
