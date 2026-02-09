import { useEffect } from "react";
import BottomNav from "./bottom-nav";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/routes";

function Layout({ children }: { children: any }) {
  const location = useLocation();

  const RouteTitleUpdater = () => {
    useEffect(() => {
      const currentRoute = ROUTES.find(
        (route) => route.path === location.pathname
      );
      document.title = `${currentRoute?.title} - PocketOwl` || "PocketOwl";
    }, [location]);

    return null;
  };

  return (
    <div className="app-shell">
      <RouteTitleUpdater />
      {children}
      <BottomNav />
    </div>
  );
}

export default Layout;
