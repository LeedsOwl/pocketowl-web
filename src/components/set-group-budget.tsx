import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CurrencyInput from "@/components/ui/currency-input"; // Make sure this component is correct and functional

interface SetGroupBudgetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
  currentBudget: number | null; // Pass the current budget if available
  onBudgetUpdate: (newBudget: number) => void; // Callback to update the budget in parent component
}

export default function SetGroupBudget({
  open,
  setOpen,
  groupId,
  currentBudget,
  onBudgetUpdate,
}: SetGroupBudgetProps) {
  const { toast } = useToast();
  const updateGroupBudget = useMutation(api.budget.setGroupBudget); // Correct mutation name

  const [budget, setBudget] = useState<number>(currentBudget || 0);

  const handleSubmit = async () => {
    // Validate the input
    if (budget <= 0) {
      toast({
        description: "Please enter a valid budget amount.",
      });
      return;
    }

    try {
      // Update the group budget using mutation
      await updateGroupBudget({
        groupId: groupId,
        budget: budget,
      });

      onBudgetUpdate(budget); // Update the budget in parent component

      toast({
        description: `Budget updated to £${budget.toFixed(2)}`,
      });

      setOpen(false); // Close the drawer
    } catch (error) {
      console.error("Error updating group budget:", error);
      toast({
        description: "Error updating budget. Please try again.",
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="sm:text-center">
          <DrawerTitle className="text-2xl">Set Group Budget</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget Amount</Label>
              <CurrencyInput
                id="budget"
                value={budget}
                onChange={(value) => setBudget(value)}
              />
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
