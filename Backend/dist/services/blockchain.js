import { ethers } from "ethers";
import { CONTRACTS, ABIS } from "../constants/abi";
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
// Await signer properly inside async function (no top-level await)
async function getSigner() {
    return provider.getSigner();
}
function getContract(address, abi, signerOrProvider) {
    return new ethers.Contract(address, abi, signerOrProvider);
}
let oracle;
let collateral;
let customToken;
let lendingPool;
// Initialization function to asynchronously get signer and contracts
export async function initContracts() {
    const signer = await getSigner();
    oracle = getContract(CONTRACTS.ORACLE, ABIS.ORACLE, signer);
    collateral = getContract(CONTRACTS.COLLATERAL_VAULT, ABIS.COLLATERAL_VAULT, signer);
    customToken = getContract(CONTRACTS.COLLATERAL_VAULT, ABIS.CUSTOM_TOKEN, signer);
    lendingPool = getContract(CONTRACTS.LENDING_POOL, ABIS.LENDING_POOL, signer);
}
export async function depositCollateral(tokenAddress, amount) {
    if (!customToken || !collateral)
        await initContracts();
    const tx0 = await customToken.approve(CONTRACTS.LENDING_POOL, BigInt(amount));
    await tx0.wait();
    const tx = await collateral.depositCollateral(tokenAddress, BigInt(amount));
    await tx.wait();
    return tx;
}
export async function withdrawCollateral(tokenAddress, amount) {
    if (!collateral)
        await initContracts();
    const tx = await collateral.withdrawCollateral(tokenAddress, BigInt(amount));
    await tx.wait();
    return tx;
}
export async function borrowmUSDC(amount) {
    if (!lendingPool)
        await initContracts();
    const tx = await lendingPool.borrow(BigInt(amount));
    await tx.wait();
    return tx;
}
export async function updatePrice(addresses, amounts) {
    if (!oracle)
        await initContracts();
    const tx = await oracle.setPrices(addresses, amounts);
    await tx.wait();
    return tx;
}
