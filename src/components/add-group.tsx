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

interface GroupMember {
  _id: Id<"group_members">;
  user_id: Id<"users">;
  invite_accepted: boolean;
}

export default function AddGroup({ open, setOpen }: AddGroupProps) {
  const { toast } = useToast();

  const groupMembers: GroupMember[] = useQuery(api.groups.getGroupMembers, {}) || [];
  const userInfo = useQuery(api.users.getUserInfo, {});

  const mutateGroup = useMutation(api.groups.setGroup);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroupMember, setSelectedGroupMember] = useState<Id<"group_members"> | undefined>(undefined);
  const [splitType, setSplitType] = useState("");
  const [splitPercentage, setSplitPercentage] = useState<number>(0);

  const handleSubmit = async () => {
    if (!userInfo) {
      console.error("User info not available");
      return;
    }
  
    if (!groupName || !description || !splitType) {
      toast({
        description: "Please fill in all required fields.",
      });
      return;
    }
  
    try {
      const addedGroup = await mutateGroup({
        name: groupName,
        created_by: userInfo._id,
        description,
        default_split_type: splitType,
        default_split_percentages: selectedGroupMember ? {
          group_member_id: selectedGroupMember,
          percentage: splitPercentage || 0,
        } : undefined,
      });
  
      toast({
        description: `Successfully added Group: ${groupName}`,
      });
  
      setOpen(false);
      setGroupName("");
      setDescription("");
      setSelectedGroupMember(undefined);
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
            <DrawerTitle className="text-2xl">Create Group</DrawerTitle>
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
