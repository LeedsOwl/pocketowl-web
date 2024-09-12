import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Id } from "convex/_generated/dataModel";
import { useTheme } from "@/theme-provider";

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const backgroundImage =
    theme === "dark" ? "/stacked-waves.svg" : "/register.svg";

  const groupDetails =
    useQuery(api.groups.getGroupDetails, { groupId: id }) || [];

  const groupMembers =
    useQuery(api.groups.getGroupMembersWithDetails, { groupId: id }) || [];

  const creatorDetails =
    useQuery(api.groups.getGroupCreatorDetails, {
      userId: groupDetails?.created_by as Id<"users">,
    }) || [];

  const groupTransactions =
    useQuery(api.groups.getGroupTransactions, { groupId: id }) || [];

  if (groupDetails === undefined || creatorDetails === undefined) {
    return <div>Loading...</div>;
  }

  const createInvite = useMutation(api.group_invites.getInvite);

  const handleInvite = async () => {
    const invite = await createInvite({
      group_id: groupDetails._id as Id<"groups">,
    });
    console.log(invite);
    console.log("Invite created", `/groups/invite/${invite?.invite_token}`);
  };

  if (!groupDetails) {
    return (
      <div className="p-4">
        <p className="text-red-500">Group not found.</p>
        <button
          onClick={() => navigate("/groups")}
          className="mt-2 text-blue-500 underline"
        >
          Go back to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-16">
        {/* Header Section */}
        <div className="sticky top-0 z-50 bg-background shadow-md">
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center justify-between">
              <Link to="/groups">
                <button
                  className="bg-transparent text-white px-2 py-2 rounded-lg hover:bg-secondary flex items-center"
                  title="Back to Groups"
                >
                  <MdChevronLeft className="text-2xl" />
                </button>
              </Link>
              <div className="text-center flex-grow">
                <p className="text-2xl font-semibold">{groupDetails.name}</p>
                <p className="text-lg font-bold text-gray-300 dark:text-gray-400">
                  {groupDetails.description}
                </p>
              </div>
              <div className="w-10"></div>
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
              Group Information
            </motion.h2>

            <div className="px-3 py-2">
              <div className="mt-1 space-y-4">
                <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
                  <p>
                    <strong>Created By:</strong>{" "}
                    {creatorDetails?.name || "Unknown User"}
                  </p>
                  <p>
                    <strong>Default Split Type:</strong>{" "}
                    {groupDetails.default_split_type}
                  </p>
                  {/* Display Default Split Percentages if applicable */}
                  {groupDetails.default_split_type === "Percentage" &&
                    groupDetails.default_split_percentages && (
                      <div className="mt-2">
                        <strong>Default Split Percentages:</strong>
                        <ul className="list-disc list-inside">
                          {groupDetails.default_split_percentages.map(
                            (split, index) => {
                              const member = groupMembers.find(
                                (member) => member._id === split.group_member_id
                              );
                              return (
                                <li key={index}>
                                  {member?.user?.name || "Unknown Member"}:{" "}
                                  {split.percentage}%
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Group Members
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {groupMembers.map((member, index) => (
                  <div key={index} className="px-3 py-2">
                    <div className="mt-1 space-y-4">
                      <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold">
                              {member.user?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {member.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-3"
            >
              <Button color="primary" className="mt-4" onClick={handleInvite}>
                <FaPlus /> Add
              </Button>
            </motion.div>
          </div>

          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Transactions
            </motion.h2>

            <div className="px-3 py-2">
              {groupTransactions.length === 0 ? (
                <p>No transactions available for this group.</p>
              ) : (
                groupTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-card border border-gray-500 shadow p-4 mb-2"
                  >
                    <p>
                      <strong>Description:</strong> {transaction.description}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Date:</strong> {transaction.dateTime}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
