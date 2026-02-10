import { ProfilePageShell } from "@/components/profile-page-shell";

function ProfileHelpCenter() {
  return (
    <ProfilePageShell
      title="Help Center"
      description="Quick answers for common questions."
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white/90">How do I add a personal expense?</p>
          <p className="mt-1 text-sm text-white/65">
            Use the top navigation plus button and choose Add Personal Expense.
          </p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white/90">How do I add a group expense?</p>
          <p className="mt-1 text-sm text-white/65">
            Open a group, then use Add Group Expense inside that group dashboard.
          </p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white/90">How do split settings work?</p>
          <p className="mt-1 text-sm text-white/65">
            Group creators can set equal, percentage, shares, fixed, or activity-based splits.
          </p>
        </div>
      </div>
    </ProfilePageShell>
  );
}

export default ProfileHelpCenter;
