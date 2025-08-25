import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockTable } from '@/components/StockTable';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Shield,
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { totalValueLocked } = useAppStore();

  const stats = [
    {
      title: 'Total Value Locked',
      value: `$${totalValueLocked}`,
      icon: DollarSign,
      change: '+12.5%',
    },
    {
      title: 'Active Borrowers',
      value: '1,247',
      icon: TrendingUp,
      change: '+8.2%',
    },
    {
      title: 'Available Liquidity',
      value: '$8.2M',
      icon: PieChart,
      change: '+15.1%',
    },
    {
      title: 'Health Factor Avg',
      value: '2.34',
      icon: Shield,
      change: '+0.1',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-center">
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary-glow" />
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              DeFi Lending Protocol
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-primary-glow">proof-of-Stocks</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Borrow stablecoins against synthetic stock collateral. Lend for competitive yields. 
            All powered by decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all shadow-glow"
            >
              <Link to="/borrow" className="space-x-2">
                <span>Start Borrowing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all shadow-glow"
            >
              <Link to="/lend" className="space-x-2">
                <span>Provide Liquidity</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="group hover:shadow-medium transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-success mt-1">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Borrow mUSDC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Deposit synthetic stock tokens as collateral and borrow mUSDC with competitive rates.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/borrow">Explore Borrowing</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-accent" />
              <span>Provide Liquidity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Deposit mUSDC into the lending pool and earn yield from borrower interest payments.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/lend">Start Lending</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span>Synthetic Stocks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Trade and use tokenized representations of major stocks as collateral in our protocol.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">View Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stock Markets Table */}
      <StockTable />
    </div>
  );
}