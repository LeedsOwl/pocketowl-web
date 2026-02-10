import { useState } from "react";
import { motion } from "framer-motion";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  LuBell,
  LuChevronRight,
  LuCreditCard,
  LuLifeBuoy,
  LuPalette,
  LuShield,
  LuUserPlus,
  LuWallet,
} from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Id } from "convex/_generated/dataModel";

interface ProfileViewProps {
  userId?: Id<"users">;
  userName: string;
  userEmail: string;
  theme: string;
  onThemeToggle: () => void;
  onSignOut: () => void;
}

export function ProfileView({
  userId,
  userName,
  userEmail,
  theme,
  onThemeToggle,
  onSignOut,
}: ProfileViewProps) {
  const updateUserPassword = useAction(api.users.updateUserPassword);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{
    loading: boolean;
    error: string;
    success: boolean;
  }>({ loading: false, error: "", success: false });

  const handlePasswordSubmit = async () => {
    if (!userId) {
      setPasswordStatus({
        loading: false,
        error: "User not loaded yet.",
        success: false,
      });
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({
        loading: false,
        error: "Please fill in all password fields.",
        success: false,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        loading: false,
        error: "New passwords do not match.",
        success: false,
      });
      return;
    }

    setPasswordStatus({ loading: true, error: "", success: false });
    try {
      await updateUserPassword({
        userId,
        oldPassword,
        newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus({ loading: false, error: "", success: true });
    } catch (error) {
      setPasswordStatus({
        loading: false,
        error: "Failed to update password. Check your current password.",
        success: false,
      });
    }
  };

  const menuItems = [
    {
      label: "Wallets",
      subtitle: "Personal: \u00A32,315.49",
      hasArrow: true,
      icon: <LuWallet className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {},
    },
    {
      label: "Payments",
      hasArrow: true,
      icon: <LuCreditCard className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {},
    },
    {
      label: "Notifications",
      hasArrow: true,
      icon: <LuBell className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {},
    },
    {
      label: "Appearance",
      subtitle: theme === "dark" ? "Dark" : "Light",
      hasArrow: true,
      icon: <LuPalette className="h-4 w-4 text-[#6f866f]" />,
      onClick: onThemeToggle,
    },
    {
      label: "Security",
      hasArrow: true,
      icon: <LuShield className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {
        setShowSecurityPanel((prev) => !prev);
        setPasswordStatus({ loading: false, error: "", success: false });
      },
    },
  ];

  const helpItems = [
    {
      label: "Help Center",
      hasArrow: true,
      icon: <LuLifeBuoy className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {},
    },
    {
      label: "Refer a friend",
      hasArrow: true,
      icon: <LuUserPlus className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => {},
    },
  ];

  return (
    <div className="surface-card rounded-3xl p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="mb-8 text-2xl font-bold text-foreground">Profile</h1>

        <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#6f866f] bg-gradient-to-br from-accent to-accent/60">
            <span className="text-2xl font-bold text-white">{userName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{userName}</h2>
              <button className="text-muted-foreground">
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                <span className="relative inline-flex h-6 w-6 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-[#6f866f]/25" />
                  <span className="absolute inset-0 rounded-full border border-transparent border-t-[#6f866f] animate-spin" />
                  <img src="/logo.png" alt="PocketOwl" className="h-[18px] w-[18px] rounded-sm object-contain" />
                </span>
                PocketOwl Plus
              </span>
              <span className="text-xs text-muted-foreground">...</span>
            </div>
          </div>
        </div>

        <button className="mb-6 w-full rounded-xl bg-muted py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/80">
          View Membership
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 space-y-1"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            onClick={item.onClick}
            className="flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted"
          >
            <div className="flex flex-1 items-start gap-3 text-left">
              {item.icon}
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                )}
              </div>
            </div>
            {item.hasArrow && <LuChevronRight className="h-5 w-5 text-muted-foreground" />}
          </motion.button>
        ))}
      </motion.div>

      {showSecurityPanel && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-6 rounded-2xl border border-white/10 bg-[#0b0f16] p-4"
        >
          <h3 className="mb-3 text-sm font-semibold text-foreground">Security</h3>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordStatus.error && (
              <p className="text-xs text-red-400">{passwordStatus.error}</p>
            )}
            {passwordStatus.success && (
              <p className="text-xs text-[#8db995]">Password updated successfully.</p>
            )}
            <Button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={passwordStatus.loading}
              className="w-full"
            >
              {passwordStatus.loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 space-y-1"
      >
        <h3 className="mb-2 px-4 text-sm font-semibold text-foreground">Help</h3>
        {helpItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + 0.1 * index }}
            onClick={item.onClick}
            className="flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <p className="text-sm font-medium text-foreground">{item.label}</p>
            </div>
            {item.hasArrow && <LuChevronRight className="h-5 w-5 text-muted-foreground" />}
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        onClick={onSignOut}
        className="w-full rounded-xl bg-destructive/10 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
      >
        Sign Out
      </motion.button>
    </div>
  );
}
