import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, injected } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { ABIS, CONTRACTS } from './abi';
import { useAccount, useWriteContract } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

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
        abi: ABIS.ERC20,
        functionName: 'mint',
        args: [address, BigInt(1000)],
        address: CONTRACTS.MUSDC,
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
        <MintButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
