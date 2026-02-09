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
        <TabsList className="tab-dock-inner flex justify-around w-full h-auto py-1">
          <TabsTrigger
            value="home"
            className="group rounded-xl px-3 py-2 text-slate-600 transition-all data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:text-slate-100"
          >
            <div className="flex flex-col items-center gap-1">
              <LuHome className="w-5 h-5 transition-transform group-data-[state=active]:-translate-y-0.5" />
              <span className="text-[11px] tracking-wide">Home</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="group rounded-xl px-3 py-2 text-slate-600 transition-all data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:text-slate-100"
          >
            <div className="flex flex-col items-center gap-1">
              <LuUsers className="w-5 h-5 transition-transform group-data-[state=active]:-translate-y-0.5" />
              <span className="text-[11px] tracking-wide">Groups</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="group rounded-xl px-3 py-2 text-slate-600 transition-all data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:text-slate-100"
          >
            <div className="flex flex-col items-center gap-1">
              <LuPieChart className="w-5 h-5 transition-transform group-data-[state=active]:-translate-y-0.5" />
              <span className="text-[11px] tracking-wide">Insights</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="group rounded-xl px-3 py-2 text-slate-600 transition-all data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:text-slate-100"
          >
            <div className="flex flex-col items-center gap-1">
              <LuUserCircle2 className="w-5 h-5 transition-transform group-data-[state=active]:-translate-y-0.5" />
              <span className="text-[11px] tracking-wide">Profile</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default BottomNav;
