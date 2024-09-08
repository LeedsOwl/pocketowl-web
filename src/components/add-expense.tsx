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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "convex/_generated/dataModel";
import CurrencyInput from "@/components/ui/currency-input";

// Dummy JSON data for categories
const dummy_categories = [
  { value: "groceries", label: "Groceries" },
  { value: "utilities", label: "Utilities" },
  { value: "shopping", label: "Shopping" },
  { value: "transportation", label: "Transportation" },
  { value: "dining", label: "Dining Out" },
];

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
  const userInfo = useQuery(api.users.getUserInfo, {});
  const mutateTransaction = useMutation(api.transactions.setTransaction);

  console.log(categories);

  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    console.log({ amount, description, category });

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
        <DrawerContent>
          <DrawerHeader className="sm:text-center">
            <DrawerTitle className="text-2xl">Add Expense</DrawerTitle>
            <DrawerDescription>
              Enter the details of your new expense.
            </DrawerDescription>
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
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
