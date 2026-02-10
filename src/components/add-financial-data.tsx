import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CurrencyInput from "@/components/ui/currency-input";

interface AddFinancialDataProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddFinancialData({
  open,
  setOpen,
}: AddFinancialDataProps) {
  const { toast } = useToast();
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});
  const saveUserFinancialData = useMutation(api.finance.setUserFinancialData);

  const [accountBalance, setAccountBalance] = useState<number>(
    userFinancialData?.account_balance || 0
  );
  const [income, setIncome] = useState<number>(userFinancialData?.income || 0);
  const [incomeType, setIncomeType] = useState<string>(
    userFinancialData?.income_type || "gross"
  );

  useEffect(() => {
    if (!userFinancialData) return;
    setAccountBalance(userFinancialData.account_balance || 0);
    setIncome(userFinancialData.income || 0);
    setIncomeType(userFinancialData.income_type || "gross");
  }, [userFinancialData]);

  const handleSubmit = async () => {
    await saveUserFinancialData({
      account_balance: accountBalance,
      income: income,
      income_type: incomeType,
    });

    toast({
      description: "Income and balance updated.",
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[94vh] max-h-[94vh] rounded-t-2xl border-[#2b352f] bg-[#0b0f16] text-white">
        <DrawerHeader className="sm:text-center">
          <DrawerTitle className="text-2xl text-white">Edit Income & Balance</DrawerTitle>
          <DrawerDescription className="text-white/65">
            Update your current balance and income baseline.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 pb-2">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-white/85">Current Balance</Label>
              <CurrencyInput
                initialValue={accountBalance}
                onChange={(value) => setAccountBalance(value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white/85">Income</Label>
              <CurrencyInput
                initialValue={income}
                onChange={(value) => setIncome(value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white/85">Income Type</Label>
              <Select onValueChange={setIncomeType} value={incomeType}>
                <SelectTrigger className="border-[#2b352f] bg-[#06080d] text-white">
                  <SelectValue placeholder="Select income type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gross">Gross (before tax)</SelectItem>
                  <SelectItem value="after_tax">After tax (net)</SelectItem>
                  <SelectItem value="disposable">Disposable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit}>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
