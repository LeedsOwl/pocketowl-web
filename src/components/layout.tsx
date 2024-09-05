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
      console.log(currentRoute);
      document.title = `${currentRoute?.title} - PocketOwl`|| "PocketOwl";
    }, [location]);

    return null; // This component doesn't render anything
  };

  return (
    <div>
      <RouteTitleUpdater />
      {children}
      <BottomNav />
    </div>
  );
}

export default Layout;
