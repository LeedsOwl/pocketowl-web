import React, { useState } from "react";
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
import GroupExpenseButton from "@/components/ui/group-expense-button";
import AddGroupExpense from "@/components/add-group-expense";
import GroupTransaction from "@/components/group-transactions"; 

function GroupDetails() {
  const { id } = useParams(); // Group ID from URL params
  const navigate = useNavigate(); // Navigate for routing

  if (!id) {
    navigate("/groups");
    return null;
  }

  const { theme } = useTheme(); // Get current theme
  const backgroundImage = theme === "dark" ? "/stacked-waves.svg" : "/register.svg";

  // Query group details, members, and transactions
  const groupDetails = useQuery(api.groups.getGroupDetails, { groupId: id }) || [];
  const groupMembers = useQuery(api.groups.getGroupMembersWithDetails, { groupId: id }) || [];
  const initialGroupTransactions = useQuery(api.groups.getGroupTransactions, { groupId: id }) || [];

  // State to store transactions
  const [groupTransactions, setGroupTransactions] = useState(initialGroupTransactions || []);

  if (!groupDetails || !groupMembers || !groupTransactions) {
    return <div>Loading...</div>;
  }

  const [inviteLink, setInviteLink] = useState("");

  // Mutation to create invite
  const createInvite = useMutation(api.group_invites.createInvite);

  const handleInvite = async () => {
    try {
      const invite = await createInvite({
        group_id: groupDetails._id as Id<"groups">,
      });
      const link = `${window.location.origin}/invite/${invite.invite_token}`;
      setInviteLink(link);
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };

  const [showAddGroupExpense, setShowAddGroupExpense] = useState(false);

  const handleAddGroupExpenseButtonClick = () => {
    setShowAddGroupExpense(!showAddGroupExpense);
  };

  // Function to handle adding a new transaction
  const handleAddTransaction = (newTransaction) => {
    setGroupTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

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
            <div className="flex items-center justify-between">
              <Link to="/groups">
                <button className="bg-transparent text-white px-2 py-2 rounded-lg hover:bg-secondary flex items-center">
                  <MdChevronLeft className="text-2xl" />
                </button>
              </Link>
              <div className="text-center flex-grow">
                <p className="text-2xl font-semibold">{groupDetails.name}</p>
                <p className="text-lg font-bold text-gray-300 dark:text-gray-400">
                  {groupDetails.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* Group Information Section */}
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
                    {groupDetails.creator?.name || "Unknown User"}
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

          {/* Group Members Section */}
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

            {/* Generate Invite Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-3"
            >
              <Button color="primary" className="mt-4" onClick={handleInvite}>
                <FaPlus /> Generate Invite Link
              </Button>
              {inviteLink && (
                <div className="mt-4">
                  <p>Invite link:</p>
                  <a href={inviteLink}>{inviteLink}</a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Group Transactions Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 rounded-lg pb-2 border shadow-md"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Group Transactions
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {groupTransactions.map((transaction, index) => (
                <GroupTransaction
                  key={index}
                  groupId={transaction.group_id}
                  description={transaction.description}
                  amount={transaction.amount}
                  date={new Date(transaction.dateTime)}
                  initiatedBy={transaction.user_name}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Add Group Expense Button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="fixed bottom-24 right-4 z-100"
          >
            <GroupExpenseButton onClick={handleAddGroupExpenseButtonClick} />
          </motion.div>

          {/* Add Group Expense Drawer */}
          <AddGroupExpense
            open={showAddGroupExpense}
            setOpen={setShowAddGroupExpense}
            groupId={id}
            onAddTransaction={handleAddTransaction} // Pass the function to update transactions
          />
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
