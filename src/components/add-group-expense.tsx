import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CurrencyInput from "@/components/ui/currency-input";

interface AddGroupExpenseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: Id<"groups">;
  onAddTransaction: (transaction: any) => void; // New prop for updating the transaction log
}

export default function AddGroupExpense({
  open,
  setOpen,
  groupId,
  onAddTransaction,
}: AddGroupExpenseProps) {
  const { toast } = useToast();

  const groupMembers = useQuery(api.groups.getGroupMembers, { groupId }) || [];
  const userInfo = useQuery(api.users.getUserInfo, {});
  const mutateGroupTransaction = useMutation(api.group_transactions.addGroupTransaction);

  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!userInfo) {
      console.error("User info not available");
      return;
    }

    const newTransaction = await mutateGroupTransaction({
      group_id: groupId,
      description: description,
      amount: amount,
      dateTime: new Date().toISOString(),
    });

    // Show success toast
    toast({
      description: `Successfully added group expense: ${description}`,
    });

    // Update the parent component with the new transaction
    onAddTransaction(newTransaction);

    // Reset form and close drawer
    setOpen(false);
    setAmount(0);
    setDescription("");
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="sm:text-center">
            <DrawerTitle className="text-2xl">Add Group Expense</DrawerTitle>
            <DrawerDescription>Enter the details of the group expense.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <CurrencyInput onChange={(value) => setAmount(value)} />
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
    </div>
  );
}
