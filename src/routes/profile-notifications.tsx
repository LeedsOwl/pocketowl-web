import { useEffect, useState } from "react";
import { ProfilePageShell } from "@/components/profile-page-shell";

function NotificationToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/20 p-4">
      <div>
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="text-xs text-white/60">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={value}
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full transition ${
          value ? "bg-[#9eb89f]" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-black transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ProfileNotifications() {
  const [expenseAlerts, setExpenseAlerts] = useState(true);
  const [groupUpdates, setGroupUpdates] = useState(true);
  const [tips, setTips] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("profile_notifications");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        expenseAlerts?: boolean;
        groupUpdates?: boolean;
        tips?: boolean;
      };
      setExpenseAlerts(Boolean(parsed.expenseAlerts));
      setGroupUpdates(Boolean(parsed.groupUpdates));
      setTips(Boolean(parsed.tips));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "profile_notifications",
      JSON.stringify({ expenseAlerts, groupUpdates, tips })
    );
  }, [expenseAlerts, groupUpdates, tips]);

  return (
    <ProfilePageShell
      title="Notifications"
      description="Control which alerts and updates you want to receive."
    >
      <div className="space-y-3">
        <NotificationToggle
          label="Expense Alerts"
          description="Get notified when a new personal transaction is added."
          value={expenseAlerts}
          onChange={setExpenseAlerts}
        />
        <NotificationToggle
          label="Group Updates"
          description="Get notified for group expenses, invites, and split changes."
          value={groupUpdates}
          onChange={setGroupUpdates}
        />
        <NotificationToggle
          label="Tips & Insights"
          description="Receive monthly budgeting tips from PocketOwl."
          value={tips}
          onChange={setTips}
        />
      </div>
    </ProfilePageShell>
  );
}

export default ProfileNotifications;
