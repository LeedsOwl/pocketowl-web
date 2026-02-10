import { useEffect } from "react";
import BottomNav from "./bottom-nav";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/routes";
import TopNav from "./top-nav";

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
      <div className={location.pathname === "/" ? "xl:hidden" : ""}>
        <TopNav />
      </div>
      {children}
      <div className={location.pathname === "/" ? "xl:hidden" : ""}>
        <BottomNav />
      </div>
    </div>
  );
}

export default Layout;
