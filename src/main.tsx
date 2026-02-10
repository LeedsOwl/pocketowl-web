import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConvexReactClient, AuthLoading } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import App from "./App";
import { ThemeProvider } from "./theme-provider";
import { LoadingSpinner } from "./components/ui/loading-animations";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Force dark theme by clearing light theme from storage
if (localStorage.getItem("vite-ui-theme") === "light") {
  localStorage.setItem("vite-ui-theme", "dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthLoading>
          <div className="grid min-h-screen place-items-center">
            <LoadingSpinner />
          </div>
        </AuthLoading>
        <App />
      </ThemeProvider>
    </ConvexAuthProvider>
  </StrictMode>
);
