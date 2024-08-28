import Home from "./routes/home";
import Login from "./routes/login";
import { Unauthenticated } from "convex/react";
import Register from "./routes/register";
import { Toaster } from "./components/ui/toaster";

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
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
];
