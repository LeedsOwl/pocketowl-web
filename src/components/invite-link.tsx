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
      <DrawerContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Invite Link</h2>
          <p className="text-sm text-gray-500">
            Share this link with your friends to invite them to your
            workspace.
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={"test"}
              className="flex-1 bg-gray-100 text-sm p-2 rounded-lg"
              readOnly
            />
            <button
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
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
