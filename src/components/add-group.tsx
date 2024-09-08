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

interface AddGroupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Category {
  _id: Id<"categories">;
  _creationTime: number;
  friendly_name: string;
  value: string;
}

export default function AddGroup({ open, setOpen }: AddGroupProps) {
  const { toast } = useToast();

  // Query the categories and user info
  const categories: Category[] = useQuery(api.categories.getCategories, {}) || [];
  const userInfo = useQuery(api.users.getUserInfo, {});
  
  // Mutation to add a group
  const mutateGroup = useMutation(api.groups.setGroup);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [splitType, setSplitType] = useState("");
  const [splitPercentage, setSplitPercentage] = useState<number>(0);

  const handleSubmit = async () => {
    if (!userInfo) {
      console.error("User info not available");
      return;
    }

    try {
      const addedGroup = await mutateGroup({
        name: groupName,
        created_by: userInfo._id,
        description,
        default_split_type: splitType,
        default_split_percentages: {
          group_member_id: "some-group-member-id", // You can fetch group members and assign this
          percentage: splitPercentage,
        },
      });

      toast({
        description: `Successfully added Group: ${groupName}`,
      });

      setOpen(false);
      setGroupName("");
      setDescription("");
      setCategory(undefined);
      setSplitType("");
      setSplitPercentage(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          description: `Error creating group: ${error.message}`,
        });
      } else {
        toast({
          description: "Unknown error occurred",
        });
      }
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="sm:text-center">
            <DrawerTitle className="text-2xl">Add Group</DrawerTitle>
            <DrawerDescription>
              Enter the details of your new Group.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Enter Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter Group description"
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
                        <SelectItem key={cat.value} value={cat._id.toString()}>
                          {cat.friendly_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Split Type</Label>
                <Select onValueChange={setSplitType} value={splitType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select split type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Split Percentage (if applicable)</Label>
                <Input
                  type="number"
                  placeholder="Enter percentage"
                  value={splitPercentage}
                  onChange={(e) => setSplitPercentage(parseFloat(e.target.value))}
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
