import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConvexReactClient, AuthLoading } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Import the Inter font
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
import "@fontsource/inter/400-italic.css"; // Specify weight and style
import App from "./App";
import { ThemeProvider } from "./theme-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthLoading>Loading...</AuthLoading>
        <App />
      </ThemeProvider>
    </ConvexAuthProvider>
  </StrictMode>
);
