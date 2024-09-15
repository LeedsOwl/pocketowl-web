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
import CurrencyInput from "@/components/ui/currency-input";

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
      <DrawerContent>
        <DrawerHeader className="sm:text-center">
          <DrawerTitle className="text-2xl">Add Group Expense</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <CurrencyInput
                id="amount"
                value={amount}
                onChange={(value) => setAmount(value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit}>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
