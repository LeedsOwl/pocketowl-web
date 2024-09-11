"use client";

import ScrollButton from "@/components/ui/scroll-button";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";
import AddGroup from "@/components/add-group";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function Groups() {
  const [showAddGroup, setShowAddGroup] = useState(false);

  // Fetch the user's actual groups from the backend
  const userGroups = useQuery(api.groups.getUserGroups, {}) || [];

  const handleAddGroupButtonClick = () => {
    setShowAddGroup(!showAddGroup);
  };

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-background shadow-md"
        >
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: "url('/stacked-waves.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="items-center text-center">
              <p className="text-2xl font-semibold">Group Split</p>
              <p className="text-lg font-bold text-gray-400">Divide bills seamlessly!</p>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-2 text-xl font-bold p-3"
        >
          Recent Groups
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {userGroups.map((group, index) => (
              <div key={index} className="px-3 py-2">
                <div className="mt-1 space-y-4">
                  <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{group.name}</p>
                        <p className="text-sm text-gray-400">{group.description}</p>
                      </div>

                      <div className="text-right">
                        <button
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary flex justify-center items-center"
                          title="View Group"
                        >
                          <MdChevronRight className="text-xl" />
                        </button>
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
          <ScrollButton onClick={handleAddGroupButtonClick} />
        </motion.div>

        <AddGroup open={showAddGroup} setOpen={setShowAddGroup} />

        <Toaster className="bottom-20" />
      </div>
    </div>
  );
}

export default Groups;
