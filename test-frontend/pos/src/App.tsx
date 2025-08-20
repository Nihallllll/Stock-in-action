import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, injected } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { ABIS, CONTRACTS } from './abi';
import { useAccount, useWriteContract } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();

function MintButton() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  async function mintMusdc() {
    if (!isConnected || !address) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      await writeContract({
        abi: ABIS.TOKEN_FACTORY,
        functionName: 'createStockToken',
        args: ["tUSDC"],
        address: CONTRACTS.TOKEN_FACTORY,
        account: address,
      });
      alert("Mint success (if you are contract owner)!");
    } catch {
      alert("Mint failed: Not contract owner or other error");
    }
  }

  return <button onClick={mintMusdc}>mint musdc</button>;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        <MintButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
