import React from "react";
import BottomNav from "./bottom-nav";

function Layout({ children }: { children: any }) {
  return (
    <div>
      {children}
      <BottomNav />
    </div>
  );
}

export default Layout;
