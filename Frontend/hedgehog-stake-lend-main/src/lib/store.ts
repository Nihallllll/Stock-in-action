import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPosition {
  collateralTokens: Array<{
    symbol: string;
    address: string;
    balance: string;
    value: string;
  }>;
  borrowedAmount: string;
  healthFactor: string;
  totalCollateralValue: string;
  liquidationRisk: boolean;
}

interface StockPrice {
  symbol: string;
  address: string;
  price: string;
  change24h: string;
}

interface AppState {
  // User state
  isConnected: boolean;
  userAddress: string | null;
  userPosition: UserPosition;
  
  // Protocol state
  stockPrices: StockPrice[];
  totalValueLocked: string;
  
  // UI state
  isDarkMode: boolean;
  
  // Actions
  setConnected: (connected: boolean, address?: string) => void;
  setUserPosition: (position: UserPosition) => void;
  updateStockPrices: (prices: StockPrice[]) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      userAddress: null,
      userPosition: {
        collateralTokens: [],
        borrowedAmount: '0',
        healthFactor: '0',
        totalCollateralValue: '0',
        liquidationRisk: false,
      },
      stockPrices: [
        { symbol: 'tAAPL', address: '0x1111111111111111111111111111111111111111', price: '175.50', change24h: '+2.5' },
        { symbol: 'tTSLA', address: '0x2222222222222222222222222222222222222222', price: '245.30', change24h: '-1.2' },
        { symbol: 'tGOOGL', address: '0x3333333333333333333333333333333333333333', price: '142.80', change24h: '+0.8' },
        { symbol: 'tMSFT', address: '0x4444444444444444444444444444444444444444', price: '378.90', change24h: '+1.1' },
        { symbol: 'tAMZN', address: '0x5555555555555555555555555555555555555555', price: '156.70', change24h: '-0.3' },
        { symbol: 'tNVDA', address: '0x6666666666666666666666666666666666666666', price: '875.20', change24h: '+4.2' },
        { symbol: 'tNFLX', address: '0x7777777777777777777777777777777777777777', price: '445.60', change24h: '+0.9' },
        { symbol: 'tCRM', address: '0x8888888888888888888888888888888888888888', price: '267.40', change24h: '-2.1' },
        { symbol: 'tADBE', address: '0x9999999999999999999999999999999999999999', price: '523.10', change24h: '+1.8' },
        { symbol: 'tBA', address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', price: '198.30', change24h: '-0.7' },
      ],
      totalValueLocked: '12,450,000',
      isDarkMode: false,

      // Actions
      setConnected: (connected, address) =>
        set({ isConnected: connected, userAddress: address || null }),

      setUserPosition: (position) =>
        set({ userPosition: position }),

      updateStockPrices: (prices) =>
        set({ stockPrices: prices }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      setDarkMode: (isDark) =>
        set({ isDarkMode: isDark }),
    }),
    {
      name: 'hedgehog-app-store',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);