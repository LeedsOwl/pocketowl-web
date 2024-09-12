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
import GroupInvite from "./routes/groupInvite";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: (
      <Authenticated>
        <Layout>
          <Home />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/groups/invite/:id",
    title: "Group Invite",
    element: <GroupInvite />,
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
