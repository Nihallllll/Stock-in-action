import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  Info,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABIS, CONTRACTS, SYNTHETIC_STOCKS } from "@/constants/contracts";
import { Address } from "viem";

export default function Borrow() {
  const { stockPrices, userPosition } = useAppStore();
  const { toast } = useToast();
  const [selectedCollateral, setSelectedCollateral] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const { address, isConnected } = useAccount();
  const maxLTV = 80; // 80% max loan-to-value ratio
  const liquidationThreshold = 85; // 85% liquidation threshold

  // Wagmi hook for writing contracts
  const { writeContract } = useWriteContract();

  // State to hold on-chain data
  const [userborrowAmount, setUserborrowAmount] = useState<number>(0);
  const [totalCollateralValue, setTotalCollateralValue] = useState<number>(0);
  const [maxBorrowAmount, setMaxBorrowAmount] = useState<number>(0);

  // Calculate health factor based on local input values:
  const calculateHealthFactor = () => {
    const collateralVal = parseFloat(collateralAmount) || 0;
    const borrowedVal = parseFloat(borrowAmount) || 0;
    if (borrowedVal === 0) return 999;
    return (collateralVal * liquidationThreshold) / 100 / borrowedVal;
  };
  const healthFactor = calculateHealthFactor();
  const isHealthy = healthFactor >= 1.5;

  // ------------------------
  // Read contract: borrowerDebt
  const {
    data: borrowerDebt,
    refetch: refetchBorrowerDebt,
  } = useReadContract({
    abi: ABIS.LENDING_POOL,
    functionName: "borrowerDebt",
    args: [address],
    address: CONTRACTS.LENDING_POOL,
   
  });

  // Read contract: collateralValue
  const {
    data: collateralValue,
    refetch: refetchCollateralValue,
  } = useReadContract({
    abi: ABIS.COLLATERAL_VAULT,
    functionName: "getCollateralValue",
    args: [address],
    address: CONTRACTS.COLLATERAL_VAULT,
   
  });

  // Update local state when on-chain data changes
  useEffect(() => {
    if (borrowerDebt !== undefined) {
      setUserborrowAmount(Number(borrowerDebt));
    }
  }, [borrowerDebt]);

  useEffect(() => {
    if (collateralValue !== undefined) {
      setTotalCollateralValue(Number(collateralValue) * 1.25);
      // Recalculate max borrow amount here to avoid stale collateralVal
      setMaxBorrowAmount(Number(collateralValue) * maxLTV / 100);
    }
  }, [collateralValue]);

  // Periodically refresh on-chain data every 5 seconds
  useEffect(() => {
    if (!address) return;
    const intervalId = setInterval(() => {
      refetchBorrowerDebt();
      refetchCollateralValue();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [address, refetchBorrowerDebt, refetchCollateralValue]);

  // ------------------------
  // Write contract: deposit collateral
  async function depositAvailableCollateral(amount: string, collateralSymbol: string) {
    if (!address) throw new Error("Wallet not connected");
    const tokenAddress: Address | undefined = SYNTHETIC_STOCKS.find(
      (t) => t.symbol === collateralSymbol
    )?.address;

    if (!tokenAddress) throw new Error("Invalid collateral token");

    // Approve collateral vault to spend collateral tokens
    await writeContract({
      abi: ABIS.CUSTOM_TOKEN,
      functionName: "approve",
      args: [CONTRACTS.COLLATERAL_VAULT, BigInt(amount)],
      address: tokenAddress,
      account: address,
      chain: undefined
    });

    // Deposit collateral to the vault
    await writeContract({
      abi: ABIS.COLLATERAL_VAULT,
      functionName: "depositCollateral",
      args: [tokenAddress, BigInt(amount)],
      address: CONTRACTS.COLLATERAL_VAULT,
      account: address,
      chain: undefined
    });
  }

  const handleDepositCollateral = async () => {
    if (!selectedCollateral || !collateralAmount) {
      toast({
        title: "Error",
        description: "Please select collateral type and amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Depositing Collateral",
      description: `Depositing ${collateralAmount} ${selectedCollateral}...`,
    });

    try {
      await depositAvailableCollateral(collateralAmount, selectedCollateral);
      toast({
        title: "Collateral Deposited!",
        description: `Successfully deposited ${collateralAmount} ${selectedCollateral}`,
      });
      // Refresh collateral value on deposit to update UI quickly
      await refetchCollateralValue();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Deposit failed",
        variant: "destructive",
      });
    }
  };

  // ------------------------
  // Write contract: borrow amount
  async function borrowAmountFromPool() {
    if (!address) throw new Error("Wallet not connected");

    await writeContract({
      abi: ABIS.LENDING_POOL,
      functionName: "borrow",
      args: [BigInt(borrowAmount)],
      address: CONTRACTS.LENDING_POOL,
      account: address,
      chain: undefined
    });
  }

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) > totalCollateralValue) {
      toast({
        title: "Error",
        description: "Invalid borrow amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Borrowing mUSDC",
      description: `Borrowing ${borrowAmount} mUSDC...`,
    });

    try {
      await borrowAmountFromPool();
      toast({
        title: "Borrow Successful!",
        description: `Successfully borrowed ${borrowAmount} mUSDC`,
      });
      // Refresh borrower debt to update UI quickly
      await refetchBorrowerDebt();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Borrow failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Borrow mUSDC</h1>
        <p className="text-muted-foreground text-lg">
          Deposit synthetic stock collateral and borrow mUSDC with competitive rates
        </p>
      </div>

      {/* Current Position Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Your Borrowing Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Collateral Value</p>
              <p className="text-2xl font-bold">${totalCollateralValue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Borrowed Amount</p>
              <p className="text-2xl font-bold">{userborrowAmount.toFixed(2)} mUSDC</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Health Factor</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-2xl font-bold">{userPosition.healthFactor}</p>
                <Badge
                  variant={
                    parseFloat(userPosition.healthFactor) >= 1.5
                      ? "default"
                      : "destructive"
                  }
                >
                  {parseFloat(userPosition.healthFactor) >= 1.5 ? "Healthy" : "At Risk"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Collateral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Deposit Collateral</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="collateral-type">Collateral Type</Label>
              <Select value={selectedCollateral} onValueChange={setSelectedCollateral}>
                <SelectTrigger>
                  <SelectValue placeholder="Select synthetic stock..." />
                </SelectTrigger>
                <SelectContent>
                  {stockPrices.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{stock.symbol}</span>
                        <span className="text-muted-foreground">${stock.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral-amount">Amount</Label>
              <Input
                id="collateral-amount"
                type="number"
                placeholder="0.00"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Balance: 1,000 {selectedCollateral || "tokens"}
              </p>
            </div>

            <Button
              onClick={handleDepositCollateral}
              className="w-full bg-gradient-primary hover:shadow-glow"
              disabled={!selectedCollateral || !collateralAmount}
            >
              Deposit Collateral
            </Button>
          </CardContent>
        </Card>

        {/* Borrow mUSDC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Borrow mUSDC</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="borrow-amount">Borrow Amount (mUSDC)</Label>
              <Input
                id="borrow-amount"
                type="number"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                max={maxBorrowAmount}
              />
              <p className="text-sm text-muted-foreground">
                Max borrowable: {maxBorrowAmount.toFixed(2)} mUSDC (80% LTV)
              </p>
            </div>

            {/* Health Factor Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Health Factor</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${isHealthy ? "text-success" : "text-destructive"}`}>
                    {healthFactor === 999 ? "∞" : healthFactor.toFixed(2)}
                  </span>
                  {!isHealthy && <AlertTriangle className="h-4 w-4 text-destructive" />}
                </div>
              </div>

              <Progress className={isHealthy ? "text-success" : "text-destructive"} />

              <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted/50">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p>Health Factor indicates your loan safety. Below 1.0 triggers liquidation.</p>
                  <p className="mt-1">Keep it above 1.5 for safety buffer.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBorrow}
              className="w-full bg-gradient-accent hover:shadow-glow"
              disabled={!borrowAmount || parseFloat(borrowAmount) > totalCollateralValue}
            >
              Borrow mUSDC
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interest Rate Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Interest Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Current Borrow Rate</p>
              <p className="text-2xl font-bold text-primary">4.25% APY</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Liquidation Threshold</p>
              <p className="text-2xl font-bold text-warning">85%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Liquidation Penalty</p>
              <p className="text-2xl font-bold text-destructive">5%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
