import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { LuHome, LuUsers, LuPieChart, LuUserCircle2 } from "react-icons/lu";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    if (path == "home") navigate("/");
    else navigate(`/${path}`);
  };

  const getTabValue = (path: string) => {
    if (path == "") return "home";
    else return path;
  };

  return (
    <div className="tab-dock">
      <Tabs
        defaultValue="home"
        value={getTabValue(location.pathname.substring(1))}
        className="flex justify-around"
        onValueChange={(value) => navigateTo(value)}
      >
        <TabsList className="tab-dock-inner flex justify-around w-full h-auto py-3">
          <TabsTrigger
            value="home"
            className="group flex-1 rounded-full p-3 text-white/50 transition-all data-[state=active]:text-white"
          >
            <LuHome className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="group flex-1 rounded-full p-3 text-white/50 transition-all data-[state=active]:text-white"
          >
            <LuUsers className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="group flex-1 rounded-full p-3 text-white/50 transition-all data-[state=active]:text-white"
          >
            <LuPieChart className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="group flex-1 rounded-full p-3 text-white/50 transition-all data-[state=active]:text-white"
          >
            <LuUserCircle2 className="w-6 h-6" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default BottomNav;
