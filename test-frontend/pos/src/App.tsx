import {
  WagmiProvider,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACTS } from "./abi";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import type { Address } from "viem";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  ssr: false,
});

const queryClient = new QueryClient();

function AddToken() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleCreate() {
    if (!isConnected) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.TOKEN_FACTORY,
        functionName: "createStockToken",
        args: ["tApple"],
        address: CONTRACTS.TOKEN_FACTORY,
        account: address,
      });
      alert("Token created successfully!");
    } catch (err) {
      console.error(err);
      alert("Create token failed!");
    }
  }

  return <button onClick={handleCreate}>Create tApple</button>;
}

function MintTokens() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleMint() {
    if (!isConnected) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.TOKEN_FACTORY,
        functionName: "mintStockToken",
        args: ["tApple", address, BigInt(10000)],
        address: CONTRACTS.TOKEN_FACTORY,
        account: address,
      });
      alert("Minted 1000 tApple!");
    } catch (err) {
      console.error(err);
      alert("Mint failed!");
    }
  }

  return <button onClick={handleMint}>Mint 1000 tApple</button>;
}

function BalanceDisplay({
  onTokenAddress,
}: {
  onTokenAddress: (addr: Address) => void;
}) {
  const { address, isConnected } = useAccount();

  // Step 1: Get token address for tApple
  const { data: tokenAddr } = useReadContract({
    abi: ABIS.TOKEN_FACTORY,
    functionName: "stockTokens",
    args: ["tApple"],
    address: CONTRACTS.TOKEN_FACTORY,
  });

  useEffect(() => {
    if (tokenAddr) onTokenAddress(tokenAddr as Address);
  }, [tokenAddr, onTokenAddress]);

  // Step 2: Get balanceOf(address)
  const { data: balance } = useReadContract({
    abi: ABIS.CUSTOM_TOKEN,
    functionName: "balanceOf",
    args: [address],
    address: tokenAddr as Address,
    query: { enabled: !!tokenAddr && !!address },
  });

  if (!isConnected) return <p>Connect wallet to see balance</p>;
  if (!tokenAddr) return <p>No tApple token deployed yet</p>;

  return <p>Your balance: {balance ? balance.toString() : "0"} tApple</p>;
}

function DepositCollateral({ tokenAddr }: { tokenAddr?: Address }) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected || !tokenAddr) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.CUSTOM_TOKEN,
        functionName: "approve",
        args: [CONTRACTS.COLLATERAL_VAULT, BigInt(1000)],
        address: tokenAddr,
        account: address,
      });

      await writeContract({
        abi: ABIS.COLLATERAL_VAULT,
        functionName: "depositCollateral",
        args: [tokenAddr, BigInt(1000)], // deposit 1000 tApple
        address: CONTRACTS.COLLATERAL_VAULT,
        account: address,
      });
      alert("Deposited 1000 tApple as collateral!");
    } catch (err) {
      console.error(err);
      alert("Deposit failed!");
    }
  }

  return <button onClick={handleDeposit}>Deposit Collateral</button>;
}

function Mintmusdc() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.ERC20,
        functionName: "mint",
        args: [address, BigInt(100000)],
        address: CONTRACTS.MUSDC,
        account: address,
      });
      alert("Minted  100000 mUSDC for you");
    } catch (err) {
      console.error(err);
      alert("Minting failed");
    }
  }

  return <button onClick={handleDeposit}>Mint mUSDC</button>;
}

function DepositemUSDC() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      // Step 1: approve
      await writeContract({
        abi: ABIS.ERC20,
        functionName: "approve",
        args: [CONTRACTS.LENDING_POOL, BigInt(1000)],
        address: CONTRACTS.MUSDC, // mUSDC token address
        account: address,
      });

      // Step 2: deposit
      await writeContract({
        abi: ABIS.LENDING_POOL,
        functionName: "deposit",
        args: [CONTRACTS.MUSDC, BigInt(1000)],
        address: CONTRACTS.LENDING_POOL, // <-- fix here
        account: address,
      });

      alert("Deposited 1000 mUSDC to the pool");
    } catch (err) {
      console.error(err);
      alert("Deposition failed");
    }
  }

  return <button onClick={handleDeposit}>Deposite mUSDC in the pool</button>;
}

function BorrowmUSDC() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.LENDING_POOL,
        functionName: "borrow",
        args: [BigInt(100)],
        address: CONTRACTS.LENDING_POOL,
        account: address,
      });
      alert("Deposited 1000 mUSDC to the pool");
    } catch (err) {
      console.error(err);
      alert("Deposition failed");
    }
  }

  return <button onClick={handleDeposit}>Borrow mUSDC from the pool</button>;
}

function GetmUSDCBalancee() {
  const { address, isConnected } = useAccount();

  const { data: tokenAmount } = useReadContract({
    abi: ABIS.LENDING_POOL,
    functionName: "getUserDebt",
    args: [address],
    address: CONTRACTS.LENDING_POOL,
  });

  return <p>"User debt :" {tokenAmount}</p>;
}

function GetCollateral({ tokenAddr }: { tokenAddr?: Address }) {
  const { address, isConnected } = useAccount();

  const { data: tokenAmount } = useReadContract({
    abi: ABIS.COLLATERAL_VAULT,
    functionName: "collateralBalance",
    args: [address, tokenAddr],
    address: CONTRACTS.COLLATERAL_VAULT,
  });

  return <p>User Collateral : {tokenAmount}</p>;
}

function SettokenValue({ tokenAddr }: { tokenAddr?: Address }) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.ORACLE,
        functionName: "setPrice",
        args: [tokenAddr, BigInt(10 * 1e18)],
        address: CONTRACTS.ORACLE,
        account: address,
      });
      alert("set price of tApple to 10 per unit");
    } catch (err) {
      console.error(err);
      alert("Deposition failed");
    }
  }

  return <button onClick={handleDeposit}>Set tApple price</button>;
}

function SetCollateralVaultAddress() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function handleDeposit() {
    if (!isConnected) {
      alert("Missing wallet or token address!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.LENDING_POOL,
        functionName: "setCollateralVault",
        args: [CONTRACTS.COLLATERAL_VAULT],
        address: CONTRACTS.LENDING_POOL,
        account: address,
      });
      alert("set price of tApple to 10 per unit");
    } catch (err) {
      console.error(err);
      alert("Deposition failed");
    }
  }

  return <button onClick={handleDeposit}>Set collateral vault address</button>;
}

function App() {
  const [tokenAddr, setTokenAddr] = useState<Address>();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
          <AddToken />
          <MintTokens />
          <BalanceDisplay onTokenAddress={setTokenAddr} />
          <DepositCollateral tokenAddr={tokenAddr} />
          <Mintmusdc />
          <DepositemUSDC />
          <SettokenValue tokenAddr={tokenAddr} />
          <SetCollateralVaultAddress />
          <BorrowmUSDC />
          <GetmUSDCBalancee />
          <GetCollateral tokenAddr={tokenAddr} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
