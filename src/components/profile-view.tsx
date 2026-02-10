import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

interface ProfileViewProps {
  userName: string;
  theme: string;
  onSignOut: () => void;
  walletSubtitle?: string;
}

export function ProfileView({
  userName,
  theme,
  onSignOut,
  walletSubtitle,
}: ProfileViewProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Wallets",
      subtitle: walletSubtitle || "Personal wallet",
      hasArrow: true,
      icon: <LuWallet className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/wallets"),
    },
    {
      label: "Payments",
      hasArrow: true,
      icon: <LuCreditCard className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/payments"),
    },
    {
      label: "Notifications",
      hasArrow: true,
      icon: <LuBell className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/notifications"),
    },
    {
      label: "Appearance",
      subtitle: theme === "dark" ? "Dark" : "Light",
      hasArrow: true,
      icon: <LuPalette className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/appearance"),
    },
    {
      label: "Security",
      hasArrow: true,
      icon: <LuShield className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/security"),
    },
  ];

  const helpItems = [
    {
      label: "Help Center",
      hasArrow: true,
      icon: <LuLifeBuoy className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/help-center"),
    },
    {
      label: "Refer a friend",
      hasArrow: true,
      icon: <LuUserPlus className="h-4 w-4 text-[#6f866f]" />,
      onClick: () => navigate("/profile/refer"),
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
