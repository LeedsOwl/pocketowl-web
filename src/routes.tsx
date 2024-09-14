import Home from "./routes/home";
import Login from "./routes/login";
import { Authenticated, Unauthenticated } from "convex/react";
import Register from "./routes/register";
import { Toaster } from "./components/ui/toaster";
import Welcome from "./routes/welcome";
import Layout from "./components/layout";
import Profile from "./routes/profile";
import Groups from "./routes/groups";
import Insights from "./routes/insights";
import GroupDetails from "./routes/groupDetails";
import InviteHandler from "./routes/inviteHandler";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api"; 

function ConditionalHome() {
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});

  if (userFinancialData === undefined) {
    return <div>Loading...</div>;
  }

  if (!userFinancialData || userFinancialData.account_balance === undefined || userFinancialData.income === undefined) {
    return <Welcome />;
  }

  return (
    <Layout>
      <Home />
    </Layout>
  );
}

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: (
      <Authenticated>
        <ConditionalHome />
      </Authenticated>
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
    path: "/login",
    title: "Login",
    element: (
      <Unauthenticated>
        <Login />
        <Toaster />
      </Unauthenticated>
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
