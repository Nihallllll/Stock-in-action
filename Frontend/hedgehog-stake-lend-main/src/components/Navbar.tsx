import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Moon, 
  Sun, 
  Wallet, 
  TrendingUp,
  DollarSign,
  PieChart,
  Settings 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import '@rainbow-me/rainbowkit/styles.css';
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const navigation = [
  { name: 'Home', href: '/', icon: TrendingUp },
  { name: 'Borrow', href: '/borrow', icon: DollarSign },
  { name: 'Lend', href: '/lend', icon: PieChart },
  { name: 'Dashboard', href: '/dashboard', icon: PieChart },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export function Navbar() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode, isConnected, userAddress } = useAppStore();

  const connectWallet = () => {
    // Mock wallet connection for demo
    const mockAddress = '0x1234...5678';
    useAppStore.getState().setConnected(true, mockAddress);
  };

  const disconnectWallet = () => {
    useAppStore.getState().setConnected(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">proof-of-Stocks</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>

            {/* Wallet Connection */}
            {/* {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right text-xs">
                  <span className="text-muted-foreground">Connected</span>
                  <span className="font-mono">{userAddress}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="space-x-2 bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )} */}
            <ConnectButton/>
            
          </div>
        </div>
      </div>
    </nav>
  );
}