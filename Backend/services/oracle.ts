import { ethers } from "ethers";
import { ABIS, CONTRACTS } from "../constants/abi.ts";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const oracle = new ethers.Contract(
 
  CONTRACTS.ORACLE,
  ABIS.ORACLE,
  wallet
);



export default oracle;
