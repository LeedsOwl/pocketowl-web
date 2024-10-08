import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import GroupButton from "@/components/ui/group-button";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";
import AddGroup from "@/components/add-group";
import { useTheme } from "../theme-provider";

function Groups() {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const userGroups = useQuery(api.groups.getUserGroups, {}) || [];

  const handleAddGroupButtonClick = () => {
    setShowAddGroup(!showAddGroup);
  };

  const { theme } = useTheme();
  const backgroundImage =
    theme === "dark" ? "/stacked-waves.svg" : "/register.svg";
  const isDarkMode = theme === "dark";

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-16">
        <div className="sticky top-0 z-50 bg-background shadow-md">
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="items-center text-center">
              <p className="text-2xl font-semibold">Group Split</p>
              <p className="text-lg font-bold text-gray-300 dark:text-gray-400">
                Divide bills seamlessly!
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Recent Groups
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {userGroups.map((group: any, index: any) => (
                  <div key={index} className="px-3 py-2">
                    <div className="mt-1 space-y-4">
                      <div
                        className={`rounded-lg border shadow p-4 ${isDarkMode ? "bg-card border-gray-500" : "bg-glossy border-gray-400"}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">
                              {group.name}
                            </p>
                            <p className="text-sm text-gray-200 dark:text-white">
                              {group.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <Link to={`/groups/${group._id}`}>
                              <button
                                className="bg-secondary dark:bg-primary text-black dark:text-white px-4 py-2 rounded-lg hover:bg-secondary flex justify-center items-center"
                                title="View Group"
                              >
                                <MdChevronRight className="text-xl" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="fixed bottom-24 right-4 z-100"
            >
              <GroupButton onClick={handleAddGroupButtonClick} />
            </motion.div>

            <AddGroup open={showAddGroup} setOpen={setShowAddGroup} />

            <Toaster className="bottom-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Groups;
