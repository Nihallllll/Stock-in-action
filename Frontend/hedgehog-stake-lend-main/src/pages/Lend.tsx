import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {useAccount, useReadContract, useWriteContract} from "wagmi";
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ABIS, CONTRACTS } from '@/constants/contracts';
import { write } from 'fs';
import { add } from 'date-fns';

export default function Lend() {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const {address ,isConnected } =useAccount();
  const [lenderDeposite ,setLenderDeposite] =useState(0);
  const {writeContract} =useWriteContract();
  const [totalDeposits , setTotalDeposits ] = useState(0);
  const [availableToWithdraw , setAvailableToWithdraw ] = useState(0);
  // async function lenderBalance() {
  //   const {data  , refetch} = useReadContract({
  //   address : CONTRACTS.LENDING_POOL,
  //   abi : ABIS.LENDING_POOL,
  //   functionName : "lenderDeposits",
  //   args : address ?[address]:undefined
  // })
  // console.log("data :" , data);
  // setLenderDeposite(Number(data));
  // }
  
  /*{
    
    user mUSDC balance 

  }*/
 const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];
  
  const { data: balance, isLoading, error } = useReadContract({
  abi: ERC20_ABI,
  address: CONTRACTS.MUSDC,
  functionName: 'balanceOf',
  args: [address],
  });
  const [mUSDCbalanace, setmUSDCbalance] =useState(0);

   useEffect(()=>{
       if (balance !== undefined) {
       setmUSDCbalance(Number(balance));
      }
    },[balance])

   const {
      data: lenderBalance,
      refetch: refetchLenderDebt,
    } = useReadContract({
      abi: ABIS.LENDING_POOL,
      functionName: "lenderDeposits",
      args: [address],
      address: CONTRACTS.LENDING_POOL
    });

  
  async function lenderDepositeTx(){
     await writeContract({
       abi: ABIS.ERC20,
       functionName: "approve",
       args: [CONTRACTS.LENDING_POOL, BigInt(depositAmount)],
       address: CONTRACTS.MUSDC, // mUSDC token address
       account: address,
       chain: undefined
     });

      // Step 2: deposit
      await writeContract({
        abi: ABIS.LENDING_POOL,
        functionName: "deposit",
        args: [ BigInt(depositAmount)],
        address: CONTRACTS.LENDING_POOL,
        account: address,
        chain: undefined
      });
  }
  
  useEffect(() => {
    refetchLenderDebt();
    if (lenderBalance) {
      setLenderDeposite(Number(lenderBalance[1]));
    }
   
    console.log("lenderBalance :" , lenderBalance)
  }, [address , lenderBalance])
 

  async function lenderWithdraw(){
    
      await writeContract({
        abi: ABIS.LENDING_POOL,
        functionName: "withdraw",
        args: [BigInt(withdrawAmount)],
        address: CONTRACTS.LENDING_POOL,
        account: address,
        chain: undefined
      });
  }
  
  
  
  /* {
    
    Total pool Balance of the pool ,
    fetching the state varible from the contract

   } */
   const {
      data: totalPoolBalance,
      refetch: refetchDepositeBalance,
    } = useReadContract({
      abi: ABIS.LENDING_POOL,
      functionName: "totalPoolBalance",
      address: CONTRACTS.LENDING_POOL
    });
    
    useEffect(() => {
       setTotalDeposits(Number(totalPoolBalance));
    }, [lenderBalance ,lenderDepositeTx])
    
   
     /* {
    
    maximum available amount ,
    fetching the "mappings" from the contract

   } */
   const {
      data: availwithDrawAmount,
      refetch: refetchavailwithDrawAmount,
    } = useReadContract({
      abi: ABIS.LENDING_POOL,
      functionName: "getLenderWithdrawAmount",
      address: CONTRACTS.LENDING_POOL,
      args : [address]
    });
    
    useEffect(() => {
       setAvailableToWithdraw(Number(availwithDrawAmount));
    }, [lenderBalance ,lenderDepositeTx])
    
  console.log("withdraw :" , availwithDrawAmount)


  // Mock data for demonstration
  const userStats = {
    deposited: lenderDeposite,
    earned: '125.50',
    availableToWithdraw: availableToWithdraw + lenderDeposite,
    currentAPY: '5.25',
  };

  const poolStats = {
    totalDeposits: totalDeposits,
    totalBorrowed: '8,920,000',
    utilizationRate: 71.6,
    supplyAPY: '5.25',
    borrowAPY: '7.85',
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Depositing mUSDC",
      description: `Depositing ${depositAmount} mUSDC to lending pool...`,
      
    });
    lenderDepositeTx();
    setTimeout(() => {
      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${depositAmount} mUSDC`,
      });
      setDepositAmount('');
    }, 2000);
  };

  const handleWithdraw =async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawing mUSDC",
      description: `Withdrawing ${withdrawAmount} mUSDC from lending pool...`,
    });
     await lenderWithdraw();
     toast({
         title: "Withdrawal Successful!",
         description: `Successfully withdrew ${withdrawAmount} mUSDC`,
     });
    // setTimeout(() => {
    //   toast({
    //     title: "Withdrawal Successful!",
    //     description: `Successfully withdrew ${withdrawAmount} mUSDC`,
    //   });
    //   setWithdrawAmount('');
    // }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Lend mUSDC</h1>
        <p className="text-muted-foreground text-lg">
          Provide liquidity to earn competitive yields from borrower interest
        </p>
      </div>

      {/* Your Lending Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Your Lending Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Deposited</p>
              <p className="text-2xl font-bold">${(userStats.deposited).toFixed(2)} mUSDC</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Interest Earned</p>
              <p className="text-2xl font-bold text-success">+${userStats.earned}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Withdraw Amount</p>
              <p className="text-2xl font-bold">${(userStats.availableToWithdraw).toFixed(2)} mUSDC</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current APY</p>
              <p className="text-2xl font-bold text-primary">{userStats.currentAPY}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lending Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Position</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit" className="space-x-2">
                  <ArrowUp className="h-4 w-4" />
                  <span>Deposit</span>
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="space-x-2">
                  <ArrowDown className="h-4 w-4" />
                  <span>Withdraw</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Deposit Amount (mUSDC)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    wallet mUSDC balance : {mUSDCbalanace}
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>You will receive:</span>
                    <span className="font-medium">{depositAmount || '0'} hmUSDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual return:</span>
                    <span className="text-success font-medium">
                      ~${((parseFloat(depositAmount) || 0) * 0.0525).toFixed(2)} mUSDC
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleDeposit}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                >
                  Deposit mUSDC
                </Button>
              </TabsContent>
              
              <TabsContent value="withdraw" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Withdraw Amount (mUSDC)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={userStats.availableToWithdraw}
                  />
                  <p className="text-sm text-muted-foreground">
                    Available: {userStats.availableToWithdraw} mUSDC
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>You will receive:</span>
                    <span className="font-medium">{withdrawAmount || '0'} mUSDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining deposit:</span>
                    <span className="font-medium">
                      {(parseFloat(String(userStats.availableToWithdraw)) - (parseFloat(withdrawAmount) || 0)).toFixed(2)} mUSDC
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleWithdraw}
                  className="w-full bg-gradient-accent hover:shadow-glow"
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                >
                  Withdraw mUSDC
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pool Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Pool Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Pool Size</span>
                <span className="font-medium">${poolStats.totalDeposits} mUSDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Borrowed</span>
                <span className="font-medium">${poolStats.totalBorrowed} mUSDC</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Utilization Rate</span>
                  <span className="font-medium">{poolStats.utilizationRate}%</span>
                </div>
                <Progress value={poolStats.utilizationRate} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-sm text-muted-foreground">Supply APY</p>
                <p className="text-lg font-bold text-success">{poolStats.supplyAPY}%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground">Borrow APY</p>
                <p className="text-lg font-bold text-primary">{poolStats.borrowAPY}%</p>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted/50">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p>Interest rates are variable and determined by supply and demand.</p>
                <p className="mt-1">Your deposits are protected by over-collateralized loans.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Rate Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Interest Rate Model</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Base Rate</p>
              <p className="text-xl font-bold">2.0%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Optimal Rate</p>
              <p className="text-xl font-bold">8.0%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Max Rate</p>
              <p className="text-xl font-bold">150%</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Interest rates automatically adjust based on pool utilization. Higher utilization = higher rates for both borrowers and lenders.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}