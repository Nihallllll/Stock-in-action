import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function StockTable() {
  const { stockPrices } = useAppStore();
  const { toast } = useToast();

  const handleMintToken = (symbol: string) => {
    toast({
      title: "Minting Stock Token",
      description: `Minting 1000 ${symbol} tokens to your wallet...`,
    });
    
    // Mock mint transaction
    setTimeout(() => {
      toast({
        title: "Mint Successful!",
        description: `1000 ${symbol} tokens have been minted to your wallet.`,
      });
    }, 2000);
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
              {stockPrices.map((stock) => {
                const isPositive = stock.change24h.startsWith('+');
                return (
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
                      <div className="font-mono font-medium">${stock.price}</div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <Badge 
                        variant={isPositive ? "default" : "destructive"}
                        className="space-x-1"
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{stock.change24h}%</span>
                      </Badge>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}