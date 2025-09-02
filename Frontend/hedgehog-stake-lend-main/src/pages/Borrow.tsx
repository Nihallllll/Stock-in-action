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
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";

interface Stock {
  symbol: string;
  price: number;
  prevPrice?: number;
  change24h?: number;
}

interface CollateralCardProps {
  handleDeposit: (symbol: string, amount: string) => void;
  handleWithdraw: (symbol: string, amount: string) => void;
}

export default function CollateralCard({
  handleDeposit,
  handleWithdraw,
}: CollateralCardProps) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [selectedCollateral, setSelectedCollateral] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [stocks, setStocks] = useState<Stock[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Connect WebSocket and listen for price updates
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3000");

    wsRef.current.onopen = () => {
      console.log("Connected to WS server");
    };

    wsRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "price_update" && Array.isArray(data.stocks)) {
          setStocks(prevStocks => {
            const prevMap = new Map(
              prevStocks.map(s => [s.symbol, s.price])
            );

            const updated = data.stocks.map((stock: any) => {
              const prevPrice = prevMap.get(stock.symbol) ?? stock.price;
              const price = parseFloat(stock.price);
              const change24h =
                prevPrice === 0 ? 0 : ((price - prevPrice) / prevPrice) * 100;

              return {
                symbol: stock.symbol,
                price,
                prevPrice,
                change24h: +change24h.toFixed(2),
              };
            });

            return updated;
          });
        }
      } catch (e) {
        console.error("Invalid WS data:", e);
      }
    };

    wsRef.current.onerror = err => {
      console.error("WS error", err);
    };

    wsRef.current.onclose = () => {
      console.log("WS connection closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Set default selected collateral to first stock symbol when stocks update
  useEffect(() => {
    if (!selectedCollateral && stocks.length > 0) {
      setSelectedCollateral(stocks[0].symbol);
    }
  }, [stocks, selectedCollateral]);

  const isDeposit = mode === "deposit";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {isDeposit ? (
              <Plus className="h-5 w-5" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
            <span>{isDeposit ? "Deposit Collateral" : "Withdraw"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(isDeposit ? "withdraw" : "deposit")}
            className="w-full bg-gradient-accent text-black hover:shadow-glow"
          >
            {isDeposit ? "Switch to Withdraw" : "Switch to Deposit"}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="collateral-type">Collateral Type</Label>
          <Select
            value={selectedCollateral}
            onValueChange={setSelectedCollateral}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stock..." />
            </SelectTrigger>
            <SelectContent>
              {isDeposit && (
                <SelectItem value="mUSDC">mUSDC - Repay the loan</SelectItem>
              )}
              {stocks.map(stock => (
                <SelectItem key={stock.symbol} value={stock.symbol}>
                  <div className="flex justify-between">
                    <span>{stock.symbol}</span>
                    <span className="text-muted-foreground">
                      ${stock.price.toFixed(2)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Balance: 1,000 {selectedCollateral || "tokens"}
          </p>
        </div>

        <Button
          className="w-full bg-gradient-accent hover:shadow-glow"
          disabled={!selectedCollateral || !amount}
          onClick={() => {
            if (isDeposit) handleDeposit(selectedCollateral, amount);
            else handleWithdraw(selectedCollateral, amount);
          }}
        >
          {isDeposit ? "Deposit Collateral" : "Withdraw"}
        </Button>
      </CardContent>
    </Card>
  );
}
