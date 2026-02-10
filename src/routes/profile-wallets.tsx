import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import AddFinancialData from "@/components/add-financial-data";
import { ProfilePageShell } from "@/components/profile-page-shell";

const GBP = "\u00A3";

function ProfileWallets() {
  const [showEdit, setShowEdit] = useState(false);
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});

  const balance = Number(userFinancialData?.account_balance || 0);
  const income = Number(userFinancialData?.income || 0);
  const incomeType = userFinancialData?.income_type || "Not set";

  return (
    <ProfilePageShell
      title="Wallets"
      description="Manage your personal balance and income preferences."
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Account Balance</p>
          <p className="mt-1 text-2xl font-semibold text-white/95">
            {GBP}
            {balance.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Income</p>
          <p className="mt-1 text-2xl font-semibold text-white/95">
            {GBP}
            {income.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-white/65">Type: {incomeType}</p>
        </div>
        <Button
          type="button"
          onClick={() => setShowEdit(true)}
          className="bg-[#101610] text-white hover:bg-[#182118]"
        >
          Edit Income & Balance
        </Button>
      </div>
      <AddFinancialData open={showEdit} setOpen={setShowEdit} />
    </ProfilePageShell>
  );
}

export default ProfileWallets;
