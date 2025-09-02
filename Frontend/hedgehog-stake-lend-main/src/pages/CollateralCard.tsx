import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
interface Stock {
  symbol: string;      // e.g. 'tAAPL'
  price: number;       // current price
  prevPrice?: number;  // previous price for calculating change
  change24h?: number;  // % change since last price update
}

export default function CollateralCard({ stockPrices, handleDeposit, handleWithdraw }) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [selectedCollateral, setSelectedCollateral] = useState("");
  const [amount, setAmount] = useState("");
  //----------
    //web soket server
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
  const isDeposit = mode === "deposit";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {isDeposit ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
            <span>{isDeposit ? "Deposit Collateral" : "Withdraw Collateral"}</span>
          </div>

          {/* Toggle button */}
          <Button 
            className="w-full bg-gradient-accent hover:shadow-glow text-black"
            variant="outline"
            size="sm"
            onClick={() => setMode(isDeposit ? "withdraw" : "deposit")}
          >
            {isDeposit ? "Switch to Withdraw" : "Switch to Deposit"}
          </Button>
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
              { isDeposit ? <SelectItem value="mUSDC">mUSDC - Repay the loan</SelectItem> : null}
              {stocks.map((stock) => (
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Balance: 1,000 {selectedCollateral || "tokens"}
          </p>
        </div>

        <Button
         className="w-full bg-gradient-accent hover:shadow-glow"
          onClick={() =>
            isDeposit
              ? handleDeposit(selectedCollateral, amount)
              : handleWithdraw(selectedCollateral, amount)
          }
        //   className={`w-full ${
        //     isDeposit
        //       ? "bg-gradient-primary hover:shadow-glow"
        //       : "bg-red-600 hover:bg-red-700"
        //   }`}
          disabled={!selectedCollateral || !amount}
        >
          {isDeposit ? "Deposit Collateral" : "Withdraw Collateral"}
        </Button>
      </CardContent>
    </Card>
  );
}
