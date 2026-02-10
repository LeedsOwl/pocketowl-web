import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
import { ProfileView } from "@/components/profile-view";
import { PageTransition } from "@/components/PageTransition";

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const { theme } = useTheme();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  // Query to fetch user info
  const userInfo = useQuery(api.users.getUserInfo, {});
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});

  const walletSubtitle =
    userFinancialData?.account_balance !== undefined
      ? `Personal: \u00A3${Number(userFinancialData.account_balance || 0).toFixed(2)}`
      : "Personal wallet";

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack">
          <div id="profile-view" className="scroll-mt-24">
            <ProfileView
              userName={userInfo?.name || "User"}
              theme={theme}
              onSignOut={handleSignOut}
              walletSubtitle={walletSubtitle}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Profile;
