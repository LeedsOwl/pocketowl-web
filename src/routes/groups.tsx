import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";
import { LuFolderKanban, LuPlus, LuSparkles, LuUsers } from "react-icons/lu";
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
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#8fb8a0]/12 blur-3xl"
              animate={{ x: [0, 18, -10, 0], y: [0, -10, 12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[-5rem] top-44 h-64 w-64 rounded-full bg-[#6f8a72]/12 blur-3xl"
              animate={{ x: [0, -16, 10, 0], y: [0, 12, -8, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.section
            id="group-split"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="surface-card relative overflow-hidden rounded-3xl p-7 scroll-mt-24 sm:p-9"
          >
            <div className="pointer-events-none absolute -left-20 top-[-30%] h-64 w-64 rounded-full bg-[#8fb8a0]/18 blur-3xl" />
            <div className="pointer-events-none absolute -right-14 bottom-[-38%] h-72 w-72 rounded-full bg-[#6f866f]/18 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(255,255,255,0.1),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-60" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                <LuSparkles className="h-3.5 w-3.5 text-[#9eb89f]" />
                Shared Spending
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight text-white/95 sm:text-4xl">
                    Group Split,
                    <br />
                    but now cinematic.
                  </h1>
                  <p className="mt-3 max-w-md text-sm text-white/65 sm:text-base">
                    Manage trips, rent, and dinner tabs in one place with live totals, smart splits, and zero clutter.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddGroupButtonClick}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-[#0b1018] text-white shadow-lg transition hover:scale-105 hover:border-[#9eb89f]"
                  aria-label="Create group"
                >
                  <LuPlus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/50">Your Groups</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{userGroups.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/50">Active</p>
                  <p className="mt-1 text-2xl font-semibold text-[#a8c1aa]">
                    {userGroups.length > 0 ? userGroups.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <section
            className="surface-card mt-2 rounded-2xl border-white/20 p-3 sm:p-4 scroll-mt-24"
            id="recent-groups"
          >
            <div className="mb-3 flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 text-xl font-semibold text-white/95"
              >
                <LuFolderKanban className="h-5 w-5 text-[#9eb89f]" />
                Recent Groups
              </motion.h2>

              <motion.button
                type="button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                onClick={handleAddGroupButtonClick}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0b1018] px-3 py-2 text-sm font-medium text-white transition hover:border-[#9eb89f] hover:bg-[#101826]"
              >
                <LuPlus className="h-4 w-4" />
                Create Group
              </motion.button>
            </div>

            {userGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <LuUsers className="h-6 w-6 text-[#9eb89f]" />
                </div>
                <p className="text-base font-medium text-white/90">No groups yet</p>
                <p className="mt-1 text-sm text-white/60">Create your first split group to get started.</p>
                <button
                  type="button"
                  onClick={handleAddGroupButtonClick}
                  className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#111722] px-4 py-2 text-sm text-white transition hover:border-[#9eb89f]"
                >
                  <LuPlus className="h-4 w-4" />
                  Create Group
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {userGroups.map((group: any) => (
                  <Link to={`/groups/${group._id}`} key={group._id}>
                    <motion.article
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      className="group rounded-2xl border border-white/10 bg-[#0d131b] p-4 transition-colors duration-200 hover:border-white/20"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-base font-semibold text-white/95">{group.name}</p>
                          <MdChevronRight className="text-xl text-white/50 transition-colors group-hover:text-white/85" />
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-white/60">
                          {group.description || "No description yet."}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </motion.div>
            )}
          </section>

          <AddGroup open={showAddGroup} setOpen={setShowAddGroup} />
          <Toaster className="bottom-20" />
        </div>
      </div>
    </PageTransition>
  );
}

export default Groups;
