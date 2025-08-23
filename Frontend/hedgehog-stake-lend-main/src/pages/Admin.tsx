import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  DollarSign, 
  Coins, 
  TrendingUp,
  Shield,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { ABIS, CONTRACTS, SYNTHETIC_STOCKS } from '@/constants/contracts';
import { useAccount, useWriteContract } from 'wagmi';

export default function Admin() {
  const { stockPrices, updateStockPrices } = useAppStore();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [faucetToken, setFaucetToken] = useState('');
  const [faucetAmount, setFaucetAmount] = useState('');
  const {address ,isConnected } =useAccount();
  const {writeContract} =useWriteContract();
  const handleUpdatePrice = () => {
    if (!selectedToken || !newPrice) {
      toast({
        title: "Error",
        description: "Please select a token and enter a price",
        variant: "destructive",
      });
      return;
    }

    const updatedPrices = stockPrices.map(stock => 
      stock.symbol === selectedToken 
        ? { ...stock, price: newPrice }
        : stock
    );

    updateStockPrices(updatedPrices);

    toast({
      title: "Price Updated",
      description: `Updated ${selectedToken} price to $${newPrice}`,
    });

    setSelectedToken('');
    setNewPrice('');
  };

  const handleFaucet = async () => {
   

    toast({
      title: "Faucet Request",
      description: `Minting ${faucetAmount} ${faucetToken} to your wallet...`,
    });

      try{
         await writeContract({
          abi: ABIS.ERC20,
          functionName: "mint",
          args: [address, BigInt(faucetAmount)],
          address: CONTRACTS.MUSDC,
          chain: undefined,
          account: address,
        })
        
        toast({
        title: "Faucet Successful!",
        description: `${faucetAmount} ${faucetToken} has been minted to your wallet`,
      });
    
      }catch{
         if (!faucetToken || !faucetAmount) {
        toast({
        title: "Error",
        description: "Please select a token and enter an amount",
        variant: "destructive",
      });
      return;
    }
      }
    

    setFaucetToken('');
    setFaucetAmount('');
  };

  const systemStats = {
    totalValueLocked: '12,450,000',
    totalBorrowed: '8,920,000',
    activeBorrowers: 1247,
    healthFactorAvg: 2.34,
    liquidationsLast24h: 3,
    protocolRevenue: '45,230',
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage protocol settings and monitor system health
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Shield className="h-4 w-4 mr-1" />
          Testnet Only
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Value Locked</p>
                <p className="text-2xl font-bold">${systemStats.totalValueLocked}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Borrowed</p>
                <p className="text-2xl font-bold">${systemStats.totalBorrowed}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Borrowers</p>
                <p className="text-2xl font-bold">{systemStats.activeBorrowers.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Health Factor</p>
                <p className="text-2xl font-bold">{systemStats.healthFactorAvg}</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Liquidations (24h)</p>
                <p className="text-2xl font-bold">{systemStats.liquidationsLast24h}</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Protocol Revenue</p>
                <p className="text-2xl font-bold">${systemStats.protocolRevenue}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Protocol Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prices" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prices">Update Prices</TabsTrigger>
              <TabsTrigger value="faucet">Token Faucet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prices" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Update Token Prices</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="token-select">Select Token</Label>
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a token..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SYNTHETIC_STOCKS.map((stock) => (
                            <SelectItem key={stock.symbol} value={stock.symbol}>
                              {stock.symbol} - {stock.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-price">New Price (USD)</Label>
                      <Input
                        id="new-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleUpdatePrice}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                      disabled={!selectedToken || !newPrice}
                    >
                      Update Price
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Prices</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stockPrices.map((stock) => (
                      <div key={stock.symbol} className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="font-mono">${stock.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faucet" className="space-y-6">
              <div className="max-w-md space-y-4">
                <h3 className="text-lg font-semibold">Token Faucet</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="faucet-token">Select Token</Label>
                    <Select value={faucetToken} onValueChange={setFaucetToken}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mUSDC">mUSDC - Stable Coin</SelectItem>
                        {SYNTHETIC_STOCKS.map((stock) => (
                          <SelectItem key={stock.symbol} value={stock.symbol}>
                            {stock.symbol} - {stock.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faucet-amount">Amount</Label>
                    <Input
                      id="faucet-amount"
                      type="number"
                      placeholder="1000"
                      value={faucetAmount}
                      onChange={(e) => setFaucetAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleFaucet}
                    className="w-full bg-gradient-accent hover:shadow-glow"
                    disabled={!faucetToken || !faucetAmount}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Mint Tokens
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Risk Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Risk Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">At-Risk Positions</h3>
              <div className="space-y-3">
                {[
                  { address: '0x1234...5678', healthFactor: '1.23', collateral: '$15,400' },
                  { address: '0x8765...4321', healthFactor: '1.45', collateral: '$8,900' },
                  { address: '0x9876...1234', healthFactor: '1.12', collateral: '$22,100' },
                ].map((position, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div>
                      <p className="font-mono text-sm">{position.address}</p>
                      <p className="text-sm text-muted-foreground">Collateral: {position.collateral}</p>
                    </div>
                    <Badge variant="destructive">
                      HF: {position.healthFactor}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Protocol Health</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10">
                  <div className="flex items-center justify-between">
                    <span>Overall System Health</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    All systems operational. No immediate risks detected.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10">
                  <div className="flex items-center justify-between">
                    <span>High Utilization Pools</span>
                    <Badge variant="outline">Monitor</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Some lending pools approaching 90% utilization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}