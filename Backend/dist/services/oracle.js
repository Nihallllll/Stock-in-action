import { ethers } from "ethers";
import { ABIS } from "../constants/abi.js";
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const oracle = new ethers.Contract(process.env.ORACLE_ADDRESS, ABIS.ORACLE, wallet);
export default oracle;
