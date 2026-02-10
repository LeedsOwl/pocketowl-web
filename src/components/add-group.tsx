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
        <DrawerContent className="h-[92vh] max-h-[92vh] rounded-t-2xl border-[#2b352f] bg-[#0b0f16] text-white">
          <DrawerHeader className="sm:text-center">
            <DrawerTitle className="text-2xl text-white">Create Group</DrawerTitle>
            <DrawerDescription className="text-white/65">
              Start a shared space for trip, home, or project expenses.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 pb-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="groupName" className="text-white/90">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g. London Trip"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-white/90">Description</Label>
                <Input
                  id="description"
                  placeholder="What is this group for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white/90">Split Type</Label>
                <Select onValueChange={setSplitType} value={splitType}>
                  <SelectTrigger className="h-11 border-[#2b352f] bg-[#06080d] text-white focus:ring-[#6f866f]">
                    <SelectValue placeholder="Select split type" />
                  </SelectTrigger>
                  <SelectContent className="border-[#2b352f] bg-[#0b0f16] text-white">
                    <SelectItem value="equal">Equal</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="shares">Shares / Units</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit} className="bg-[#101610] text-white hover:bg-[#182118]">
              Create Group
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
    </div>
  );
}
