import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t">
      <Tabs
        defaultValue="home"
        value={getTabValue(location.pathname.substring(1))}
        className="flex justify-around"
        onValueChange={(value) => navigateTo(value)}
      >
        <TabsList className="bg-background flex justify-around w-full py-10">
          <TabsTrigger
            value="home"
            className="data-[state=active]:bg-primary text-muted-foreground data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <LuHome className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-primary text-muted-foreground data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <LuUsers className="w-6 h-6" />
              <span className="text-xs">Groups</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-primary text-muted-foreground data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <LuPieChart className="w-6 h-6" />
              <span className="text-xs">Insights</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary text-muted-foreground data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <LuUserCircle2 className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default BottomNav;
