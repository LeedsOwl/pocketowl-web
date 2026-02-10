import Home from "./routes/home";
import Login from "./routes/login";
import { Authenticated, Unauthenticated } from "convex/react";
import Register from "./routes/register";
import { Toaster } from "./components/ui/toaster";
import Welcome from "./routes/welcome";
import Layout from "./components/layout";
import Profile from "./routes/profile";
import ProfileWallets from "./routes/profile-wallets";
import ProfilePayments from "./routes/profile-payments";
import ProfileNotifications from "./routes/profile-notifications";
import ProfileAppearance from "./routes/profile-appearance";
import ProfileSecurity from "./routes/profile-security";
import ProfileHelpCenter from "./routes/profile-help-center";
import ProfileRefer from "./routes/profile-refer";
import Groups from "./routes/groups";
import Insights from "./routes/insights";
import GroupDetails from "./routes/groupDetails";
import InviteHandler from "./routes/inviteHandler";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ConditionalHome() {
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      const shouldShow = !userFinancialData || userFinancialData.account_balance === undefined || userFinancialData.income === undefined;
      if (shouldShow) {
        localStorage.removeItem('hasSeenWelcome');
        setShowWelcome(true);
      }
      else {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
      }
    }
  }, [userFinancialData]);

  const handleWelcomeClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Welcome onClose={handleWelcomeClose} />;
  }

  return (
    <Layout>
      <Home />
    </Layout>
  );
}

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
}

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: (
      <>
        <Authenticated>
          <ConditionalHome />
        </Authenticated>
        <Unauthenticated>
          <RedirectToLogin />
        </Unauthenticated>
      </>
    ),
  },
  {
    path: "/invite/:invite_token",
    title: "Group Invite",
    element: (
      <InviteHandler />
    ),
  },
  {
    path: "/groups/:id",
    title: "Group",
    element: (
      <Authenticated>
        <Layout>
          <GroupDetails />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/groups",
    title: "Groups",
    element: (
      <Authenticated>
        <Layout>
          <Groups />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/insights",
    title: "Insights",
    element: (
      <Authenticated>
        <Layout>
          <Insights />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile",
    title: "Profile",
    element: (
      <Authenticated>
        <Layout>
          <Profile />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/wallets",
    title: "Wallets",
    element: (
      <Authenticated>
        <Layout>
          <ProfileWallets />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/payments",
    title: "Payments",
    element: (
      <Authenticated>
        <Layout>
          <ProfilePayments />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/notifications",
    title: "Notifications",
    element: (
      <Authenticated>
        <Layout>
          <ProfileNotifications />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/appearance",
    title: "Appearance",
    element: (
      <Authenticated>
        <Layout>
          <ProfileAppearance />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/security",
    title: "Security",
    element: (
      <Authenticated>
        <Layout>
          <ProfileSecurity />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/help-center",
    title: "Help Center",
    element: (
      <Authenticated>
        <Layout>
          <ProfileHelpCenter />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/profile/refer",
    title: "Refer a Friend",
    element: (
      <Authenticated>
        <Layout>
          <ProfileRefer />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/login",
    title: "Login",
    element: (
      <>
        <Unauthenticated>
          <Login />
          <Toaster />
        </Unauthenticated>
        <Authenticated>
          <RedirectToHome />
        </Authenticated>
      </>
    ),
  },
  {
    path: "/register",
    title: "Register",
    element: (
      <Unauthenticated>
        <Register />
        <Toaster />
      </Unauthenticated>
    ),
  },
  {
    path: "/welcome",
    title: "Welcome",
    element: (
      <Authenticated>
        <Welcome />
      </Authenticated>
    ),
  },
];
