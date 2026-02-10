import React, { useState } from "react";
import { useMutation } from "convex/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGroupExpenseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;  // The groupId is passed as a prop
  onAddTransaction: (transaction: any) => void;
}

export default function AddGroupExpense({
  open,
  setOpen,
  groupId,  // Destructure the groupId from props
  onAddTransaction,
}: AddGroupExpenseProps) {
  const { toast } = useToast();
  const mutateGroupTransaction = useMutation(api.group_transactions.addGroupTransaction);

  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    // Validate the inputs
    if (!description || amount <= 0) {
      console.error("Invalid description or amount");
      return;
    }

    try {
      const newTransaction = {
        groupId: groupId,  // Use the `groupId` prop here
        description: description,
        amount: amount,
        dateTime: new Date().toISOString(), // Send the current date in ISO format
        user_name: "Current User",  // Replace this with the actual user info
      };

      const addedTransaction = await mutateGroupTransaction(newTransaction);
      onAddTransaction(addedTransaction);  // Call the callback to update transactions

      toast({
        description: `Successfully added group expense: ${description}`,
      });

      setOpen(false);  // Close the drawer
      setAmount(0);  // Reset the form
      setDescription("");
    } catch (error) {
      console.error("Error adding group expense:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[90vh] max-h-[90vh] rounded-t-2xl border-[#2b352f] bg-[#0b0f16] text-white">
        <DrawerHeader className="sm:text-center">
          <DrawerTitle className="text-2xl text-white">Add Group Expense</DrawerTitle>
          <DrawerDescription className="text-white/65">
            Log what you spent so it updates group totals instantly.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 pb-2">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-white/90">
                Amount
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  £
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                  className="h-11 border-[#2b352f] bg-[#06080d] pl-7 text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white/90">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#101610] text-white hover:bg-[#182118]"
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-[#2b352f] bg-[#06080d] text-white hover:bg-[#101826]"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
