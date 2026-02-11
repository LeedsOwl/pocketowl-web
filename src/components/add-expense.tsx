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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "convex/_generated/dataModel";
import CurrencyInput from "@/components/ui/currency-input";

interface AddExpenseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Category {
  _id: Id<"categories">;
  _creationTime: number;
  friendly_name: string;
  value: string;
}

export default function AddExpense({ open, setOpen }: AddExpenseProps) {
  const { toast } = useToast();

  const categories: Category[] =
    useQuery(api.categories.getCategories, {}) || [];
  const ensureDefaultCategories = useMutation(api.categories.ensureDefaultCategories);
  const userInfo = useQuery(api.users.getUserInfo, {});
  const mutateTransaction = useMutation(api.transactions.setTransaction);

  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [didAttemptSeed, setDidAttemptSeed] = useState(false);

  useEffect(() => {
    if (didAttemptSeed) return;
    if (categories.length > 0) return;

    setDidAttemptSeed(true);
    void ensureDefaultCategories();
  }, [categories.length, didAttemptSeed, ensureDefaultCategories]);

  const handleSubmit = async () => {
    if (!userInfo) {
      console.error("User info not available");
      return;
    }

    const addedTransaction = await mutateTransaction({
      user_id: userInfo._id,
      dateTime: new Date().toISOString(),
      description: description,
      amount: amount,
      category: category as Id<"categories">,
    });
    toast({
      description: `Successfully added expense: ${description}`,
    });

    setOpen(false);
    // Reset form fields
    setAmount(0);
    setDescription("");
    setCategory("");
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[94vh] max-h-[94vh] rounded-t-2xl border-[#2b352f] bg-[#0b0f16] text-white">
          <DrawerHeader className="sm:text-center">
            <DrawerTitle className="text-2xl text-white">Add Expense</DrawerTitle>
            <DrawerDescription className="text-white/65">
              What did you spend on? Fill in the details below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 pb-2">
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
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger className="border-[#2b352f] bg-[#06080d] text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="border-[#2b352f] bg-[#0b0f16] text-white">
                    {categories &&
                      categories.map((cat: Category) => (
                        <SelectItem key={cat.value} value={cat._id}>
                          {cat.friendly_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
