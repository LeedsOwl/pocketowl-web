import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfilePageShell } from "@/components/profile-page-shell";

function ProfileSecurity() {
  const userInfo = useQuery(api.users.getUserInfo, {});
  const updateUserPassword = useAction(api.users.updateUserPassword);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ loading: boolean; error: string; success: string }>({
    loading: false,
    error: "",
    success: "",
  });

  const handlePasswordSubmit = async () => {
    if (!userInfo?._id) {
      setStatus({ loading: false, error: "User not loaded yet.", success: "" });
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus({ loading: false, error: "Please fill in all password fields.", success: "" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ loading: false, error: "New passwords do not match.", success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });
    try {
      await updateUserPassword({
        userId: userInfo._id,
        oldPassword,
        newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus({ loading: false, error: "", success: "Password updated successfully." });
    } catch {
      setStatus({
        loading: false,
        error: "Failed to update password. Check your current password.",
        success: "",
      });
    }
  };

  return (
    <ProfilePageShell
      title="Security"
      description="Update your password and keep your account secure."
    >
      <div className="space-y-3">
        <Input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
        />
        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-11 border-[#2b352f] bg-[#06080d] text-white placeholder:text-white/45 focus-visible:ring-[#6f866f]"
        />
        {status.error ? <p className="text-xs text-red-400">{status.error}</p> : null}
        {status.success ? <p className="text-xs text-[#8db995]">{status.success}</p> : null}
        <Button
          type="button"
          onClick={handlePasswordSubmit}
          disabled={status.loading}
          className="bg-[#101610] text-white hover:bg-[#182118]"
        >
          {status.loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </ProfilePageShell>
  );
}

export default ProfileSecurity;
