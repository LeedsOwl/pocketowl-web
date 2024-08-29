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

export const ROUTES = [
  {
    path: "/",
    element: (
      <Authenticated>
        <Layout>
          <Home />
        </Layout>
      </Authenticated>
    ),
  },
  {
    path: "/groups",
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
    element: (
      <Unauthenticated>
        <Login />
        <Toaster />
      </Unauthenticated>
    ),
  },
  {
    path: "/register",
    element: (
      <Unauthenticated>
        <Register />
        <Toaster />
      </Unauthenticated>
    ),
  },
  {
    path: "/welcome",
    element: (
      <Authenticated>
        <Welcome />
      </Authenticated>
    ),
  },
];
