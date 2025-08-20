import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  DollarSign,
  Target,
  Activity,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';

export default function Dashboard() {
  const { userPosition, stockPrices, isConnected } = useAppStore();

  // Mock user portfolio data
  const portfolio = {
    collateralTokens: [
      { symbol: 'tAAPL', balance: '100', value: '17,550', address: '0x1111' },
      { symbol: 'tTSLA', balance: '50', value: '12,265', address: '0x2222' },
      { symbol: 'tGOOGL', balance: '75', value: '10,710', address: '0x3333' },
    ],
    borrowedAmount: '25,000',
    healthFactor: '2.34',
    totalCollateralValue: '40,525',
    liquidationRisk: false,
  };

  const healthFactorValue = parseFloat(portfolio.healthFactor);
  const isHealthy = healthFactorValue >= 1.5;
  const utilizationRate = (parseFloat(portfolio.borrowedAmount) / parseFloat(portfolio.totalCollateralValue)) * 100;

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="p-8">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your portfolio and manage your positions
          </p>
          <Button className="bg-gradient-primary hover:shadow-glow">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your positions and manage your portfolio
          </p>
        </div>
        <Badge 
          variant={isHealthy ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          {isHealthy ? "Portfolio Healthy" : "Liquidation Risk"}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-medium transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Collateral</p>
                <p className="text-2xl font-bold">${portfolio.totalCollateralValue}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-medium transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Borrowed</p>
                <p className="text-2xl font-bold">${portfolio.borrowedAmount}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-medium transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Health Factor</p>
                <p className={`text-2xl font-bold ${isHealthy ? 'text-success' : 'text-destructive'}`}>
                  {portfolio.healthFactor}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isHealthy ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {isHealthy ? (
                  <Shield className="h-6 w-6 text-success" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-medium transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Utilization</p>
                <p className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <Activity className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collateral Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Collateral Positions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.collateralTokens.map((token) => (
                <div key={token.symbol} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {token.symbol.replace('t', '')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.balance} tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${token.value}</p>
                    <p className="text-sm text-success">
                      {((parseFloat(token.value) / parseFloat(portfolio.totalCollateralValue)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link to="/borrow">Manage Collateral</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Risk Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Health Factor Progress */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Health Factor</span>
                <span className={`text-sm font-medium ${isHealthy ? 'text-success' : 'text-destructive'}`}>
                  {portfolio.healthFactor}
                </span>
              </div>
              <Progress 
                value={Math.min(100, (healthFactorValue / 3) * 100)} 
                className={isHealthy ? 'text-success' : 'text-destructive'}
              />
              <p className="text-xs text-muted-foreground">
                {isHealthy 
                  ? 'Your position is healthy with good safety margin'
                  : 'Warning: Your position is at risk of liquidation'
                }
              </p>
            </div>

            {/* Utilization Rate */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Utilization Rate</span>
                <span className="text-sm font-medium">{utilizationRate.toFixed(1)}%</span>
              </div>
              <Progress value={utilizationRate} />
              <p className="text-xs text-muted-foreground">
                Percentage of collateral value being borrowed
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/borrow">Add Collateral</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/borrow">Repay Debt</Link>
                </Button>
              </div>
            </div>

            {/* Risk Alerts */}
            {!isHealthy && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Liquidation Risk</p>
                    <p className="text-muted-foreground mt-1">
                      Your health factor is below 1.5. Consider adding more collateral or repaying debt.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'Deposit', asset: 'tAAPL', amount: '50', time: '2 hours ago', status: 'completed' },
              { type: 'Borrow', asset: 'mUSDC', amount: '5,000', time: '1 day ago', status: 'completed' },
              { type: 'Repay', asset: 'mUSDC', amount: '1,000', time: '3 days ago', status: 'completed' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.type} {activity.asset}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <p className="font-medium">{activity.amount}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}