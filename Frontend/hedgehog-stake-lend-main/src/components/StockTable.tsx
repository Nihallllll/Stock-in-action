import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { writeContract } from 'viem/actions';
import { ABIS, CONTRACTS } from '@/constants/contracts';
import { useAccount, useWriteContract } from 'wagmi';
import { add } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface Stock {
  symbol: string;      // e.g. 'tAAPL'
  price: number;       // current price
  prevPrice?: number;  // previous price for calculating change
  change24h?: number;  // % change since last price update
}

export function StockTable() {
  const { stockPrices } = useAppStore();
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  //----------------
  // Websocket integration
  const [stocks, setStocks] = useState<Stock[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3000'); // Update URL if needed

    wsRef.current.onopen = () => {
      console.log('Connected to WS server');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'price_update' && Array.isArray(data.stocks)) {
          setStocks((prevStocks) => {
            // Create a map of previous prices for efficient lookup
            const prevPricesMap = new Map(prevStocks.map(s => [s.symbol, s.price]));

            // Map incoming stocks and calculate change based on prevPricesMap
            const updatedStocks = data.stocks.map((stock: any) => {
              const prevPrice = prevPricesMap.get(stock.symbol) ?? stock.price;
              const price = parseFloat(stock.price);
              const change24h = prevPrice === 0 ? 0 : ((price - prevPrice) / prevPrice) * 100;
              return {
                symbol: stock.symbol,
                price,
                prevPrice,
                change24h: parseFloat(change24h.toFixed(2)),
              };
            });

            return updatedStocks;
          });
        }
      } catch (e) {
        console.error('Invalid WS data:', e);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error('WS error', err);
    };

    wsRef.current.onclose = () => {
      console.log('WS connection closed');
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  async function MintStockToken(symbol: string) {
    await writeContract({
      abi: ABIS.TOKEN_FACTORY,
      functionName: "mintStockToken",
      args: [symbol, address, BigInt(1000)],
      address: CONTRACTS.TOKEN_FACTORY,
      account: address,
      chain: undefined,
    });
  }

  const handleMintToken = async (symbol: string) => {
    toast({
      title: "Minting Stock Token",
      description: `Minting 1000 ${symbol} tokens to your wallet...`,
    });
    await MintStockToken(symbol);
    toast({
      title: "Mint Successful!",
      description: `1000 ${symbol} tokens have been minted to your wallet.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Coins className="h-5 w-5" />
          <span>Synthetic Stock Markets</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Asset</th>
                <th className="text-right py-3 px-4 font-medium">Price</th>
                <th className="text-right py-3 px-4 font-medium">24h Change</th>
                <th className="text-right py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {stock.symbol.replace('t', '')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {stock.symbol.replace('t', '')} Stock Token
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className="font-mono font-medium">${stock.price.toFixed(2)}</div>
                  </td>
                  <td className="text-right py-4 px-4">
                    {/* Uncomment and use Badge if needed */}
                    {/* <Badge
                      variant={stock.change24h! >= 0 ? "default" : "destructive"}
                      className="space-x-1"
                    >
                      {stock.change24h! >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{stock.change24h}%</span>
                    </Badge> */}
                  </td>
                  <td className="text-right py-4 px-4">
                    <Button
                      size="sm"
                      onClick={() => handleMintToken(stock.symbol)}
                      className="bg-gradient-accent hover:shadow-glow transition-all"
                    >
                      Mint {stock.symbol}
                    </Button>
                  </td>
                </tr>
              ))}
              {stocks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading stock prices...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
