import React from "react";
import { Drawer, DrawerContent } from "./ui/drawer";

interface AddExpenseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invite: any;
}

function InviteLink({ open, setOpen, invite }: AddExpenseProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[70vh] max-h-[70vh] rounded-t-2xl border-[#2b352f] bg-[#0b0f16] text-white">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Invite Link</h2>
          <p className="text-sm text-white/65">
            Share this link with your friends to invite them to your
            workspace.
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={"test"}
              className="flex-1 rounded-lg border border-[#2b352f] bg-[#06080d] p-2 text-sm text-white"
              readOnly
            />
            <button
              className="bg-[#6f866f] text-white text-sm px-4 py-2 rounded-lg"
              onClick={() => navigator.clipboard.writeText(invite)}
            >
              Copy
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default InviteLink;
