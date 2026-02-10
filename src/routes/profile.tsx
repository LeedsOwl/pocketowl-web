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
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  // Query to fetch user info
  const userInfo = useQuery(api.users.getUserInfo, {});

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack">
          <div id="profile-view" className="scroll-mt-24">
            <ProfileView
              userId={userInfo?._id}
              userName={userInfo?.name || "User"}
              userEmail={userInfo?.email || "user@example.com"}
              theme={theme}
              onThemeToggle={handleThemeToggle}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Profile;
