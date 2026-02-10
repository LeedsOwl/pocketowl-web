import { ProfilePageShell } from "@/components/profile-page-shell";

function ProfilePayments() {
  return (
    <ProfilePageShell
      title="Payments"
      description="Payment methods for subscriptions and premium features."
    >
      <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
        <p className="text-sm text-white/80">
          Payment method management is not connected yet.
        </p>
        <p className="mt-2 text-sm text-white/60">
          You can still use all personal and group expense features without adding a card.
        </p>
      </div>
    </ProfilePageShell>
  );
}

export default ProfilePayments;
