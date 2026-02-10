import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProfilePageShell } from "@/components/profile-page-shell";
import { Button } from "@/components/ui/button";

function ProfileRefer() {
  const userInfo = useQuery(api.users.getUserInfo, {});

  const referralLink = useMemo(() => {
    const token = userInfo?._id || "pocketowl";
    return `${window.location.origin}/register?ref=${token}`;
  }, [userInfo?._id]);

  return (
    <ProfilePageShell
      title="Refer a Friend"
      description="Share PocketOwl with someone who wants clearer finances."
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Your referral link</p>
          <p className="mt-2 break-all text-sm text-white/85">{referralLink}</p>
        </div>
        <Button
          type="button"
          onClick={() => navigator.clipboard.writeText(referralLink)}
          className="bg-[#101610] text-white hover:bg-[#182118]"
        >
          Copy Referral Link
        </Button>
      </div>
    </ProfilePageShell>
  );
}

export default ProfileRefer;
