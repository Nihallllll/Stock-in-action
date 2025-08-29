import { useState } from "react";
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

export default function CollateralCard({ stockPrices, handleDeposit, handleWithdraw }) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [selectedCollateral, setSelectedCollateral] = useState("");
  const [amount, setAmount] = useState("");

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
