import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import GroupButton from "@/components/ui/group-button";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";
import AddGroup from "@/components/add-group";
import { PageTransition } from "@/components/PageTransition";

function Groups() {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const userGroups = useQuery(api.groups.getUserGroups, {}) || [];

  const handleAddGroupButtonClick = () => {
    setShowAddGroup(!showAddGroup);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack">
        <div className="surface-card relative overflow-hidden rounded-2xl p-10 shadow-2xl">
          <div className="pointer-events-none absolute -top-20 left-[-10%] h-52 w-52 rounded-full bg-[#7dade2]/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-[-12%] h-56 w-56 rounded-full bg-[#8cb9dc]/16 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7dade2]/8 via-transparent to-[#8cb9dc]/10 dark:from-[#7dade2]/12 dark:to-[#000000]/20" />
          <div className="relative z-10 items-center text-center">
            <p className="text-2xl font-semibold tracking-wide text-slate-900 dark:text-slate-100">Group Split</p>
            <p className="text-sm font-medium tracking-[0.12em] uppercase text-slate-600 dark:text-slate-300">
              Divide bills seamlessly
            </p>
          </div>
        </div>

        <div className="pt-1">
          <div className="surface-card mt-2 rounded-xl border-white/25 pb-2">
            <div className="flex justify-between items-center p-3 pb-1">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl font-bold text-slate-900 dark:text-slate-100"
              >
                Recent Groups
              </motion.h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <GroupButton onClick={handleAddGroupButtonClick} />
              </motion.div>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {userGroups.map((group: any, index: any) => (
                <Link to={`/groups/${group._id}`} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="surface-card group relative cursor-pointer overflow-hidden rounded-lg border-white/25 p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                  >
                    {/* Animated gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300"></div>

                    <div className="relative z-10 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="mb-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                          {group.name}
                        </p>
                        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                          {group.description}
                        </p>
                      </div>

                      {/* Animated arrow button */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="ml-3 bg-gradient-to-r from-primary to-primary/80 text-white p-3 rounded-full shadow-lg group-hover:shadow-[0_0_25px_rgba(125,173,226,0.28),0_0_40px_rgba(140,185,220,0.18)]"
                      >
                        <MdChevronRight className="text-xl" />
                      </motion.div>
                    </div>

                    {/* Subtle bottom glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        <AddGroup open={showAddGroup} setOpen={setShowAddGroup} />
        <Toaster className="bottom-20" />
        </div>
      </div>
    </PageTransition>
  );
}

export default Groups;
