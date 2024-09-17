import React, { useState, useMemo, useEffect } from "react";
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
import EqualSplit from "@/components/EqualSplit";
import PercentageSplit from "@/components/PercentageSplit";
import CustomSplit from "@/components/CustomSplit";
import { Progress } from "@/components/ui/progress";
import SetGroupBudget from "@/components/set-group-budget";
import { FaPencilAlt } from "react-icons/fa";
import GroupVoting from "@/components/group-voting";

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
  const groupTransactions = useQuery(
    api.group_transactions.getGroupTransactions,
    { groupId: id }  // Fetch transactions for the specific group
  ) || [];

  if (!groupDetails || !groupMembers || !groupTransactions) {
    return <div>Loading...</div>;
  }

  // State to manage the budget drawer
  const [showSetBudget, setShowSetBudget] = useState(false);

  // Function to handle budget update
  const handleBudgetUpdate = async (newBudget: number) => {
    try {
      await api.budget.setGroupBudget({ groupId: id, budget: newBudget });
      // Optionally refresh the group details or set a local state
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const [groupTransaction, setGroupTransactions] = useState([]);
  const [showAddGroupExpense, setShowAddGroupExpense] = useState(false);

  useEffect(() => {
    console.log("Drawer open state changed:", showAddGroupExpense);
  }, [showAddGroupExpense]);

  // Calculate the total amount of transactions
  const totalAmount = useMemo(() => {
    return groupTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  }, [groupTransactions]);

  const groupBudget = groupDetails.budget || 0;
  const progressPercentage = groupBudget > 0 ? (totalAmount / groupBudget) * 100 : 0;

  const [inviteLink, setInviteLink] = useState("");

  // Mutation to create invite

  const createInvite = useMutation(api.group_invites.createInvite);

  const fetchedGroupMembers = useQuery(api.groups.getGroupMembersWithDetails, { groupId: id });

  // Manually refetch group members
  const refetchGroupMembers = () => {
    setGroupMembers(fetchedGroupMembers);
  };

  const handleInvite = async () => {
    try {
      const invite = await createInvite({
        group_id: groupDetails._id as Id<"groups">,
      });
      const link = `${window.location.origin}/invite/${invite.invite_token}`;
      setInviteLink(link);

      // Refetch group members after inviting
      refetchGroupMembers();  // Update the group members state
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };


  const handleAddGroupExpenseButtonClick = () => {
    setShowAddGroupExpense(!showAddGroupExpense);
  };

  // Function to handle adding a new transaction
  const handleAddTransaction = (newTransaction) => {
    setGroupTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-36">
        <div className="sticky top-0 z-50 bg-background shadow-md">
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-2xl font-semibold">{groupDetails.name}</p>
              <p className="text-lg font-bold text-gray-300 dark:text-gray-400">
                {groupDetails.description}
              </p>
            </div>
          </div>
        </div>
        <div className="p-2">

          {/* Group Members Section (in list format) */}
          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Group Members
            </motion.h2>
            <div className="px-3 py-2">
              <ul className="list-none space-y-2"> {/* Removed list-disc and added space between members */}
                {groupMembers.map((member) => (
                  <li key={member._id} className="flex items-center space-x-2">
                    {/* Profile Picture Circle */}
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold">
                      {member.user?.name ? member.user.name[0] : "?"} {/* Display initial */}
                    </div>

                    {/* Member Name */}
                    <span className="text-lg">
                      {member.user?.name || "Unknown User"}
                    </span>

                    {/* Crown Icon for Creator */}
                    {member.user_id === groupDetails.created_by && (
                      <img
                        src="/crown.gif"
                        alt="Creator"
                        className="w-6 h-6 ml-2 rounded-full border border-primary"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Invite Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-3 flex flex-col items-center"  // Center the content
          >
            <Button
              variant="primary"
              className="mt-4 rounded-lg bg-primary text-white px-6 py-3"  // Rounded, bg-primary, larger button
              onClick={handleInvite}
            >
              <FaPlus className="mr-2" /> Invite friends/family
            </Button>

            {inviteLink && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-gray-500 mb-2">Invite link:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="border px-2 py-1 rounded-lg w-64 text-background"
                  />
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => navigator.clipboard.writeText(inviteLink)}  // Copy to clipboard functionality
                  >
                    Copy link
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Voting Mechanism Section */}
          <div className="mt-4">
            <GroupVoting groupId={id} />
          </div>

          {/* Total Amount Section with Progress Bar */}
          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1 flex items-center justify-between"
            >
              Total Expenses
              {/* Set Budget Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetBudget(true)}
                className="ml-2"
              >
                <FaPencilAlt className="mr-1" /> Set Budget
              </Button>
            </motion.h2>
            <div className="px-3 py-2">
              <p className="text-lg font-bold">
                Total: £{totalAmount.toFixed(2)}{" "}
                {groupBudget > 0 && (
                  <>
                    / £{groupBudget.toFixed(2)}
                  </>
                )}
              </p>
              {/* Progress Bar */}
              {groupBudget > 0 ? (
                <Progress value={progressPercentage} className="w-full" />
              ) : (
                <p className="text-sm text-gray-500">
                  No budget set. Click "Set Budget" to add one.
                </p>
              )}
            </div>
            {/* Split Type Display */}
            {groupDetails.default_split_type === "equal" && (
              <EqualSplit totalAmount={totalAmount} groupMembers={groupMembers} />
            )}
            {groupDetails.default_split_type === "percentage" && (
              <PercentageSplit
                totalAmount={totalAmount}
                groupMembers={groupMembers}
                splitPercentages={groupDetails.default_split_percentages}
              />
            )}
            {groupDetails.default_split_type === "custom" && (
              <CustomSplit
                totalAmount={totalAmount}
                groupMembers={groupMembers}
                customSplitData={{}}
              />
            )}
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
              Transactions
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {groupTransactions.map((transaction, index) => (
                <GroupTransaction
                  key={transaction._id}
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

          <div className="fixed bottom-20 left-0 p-4">
            <Link to="/groups">
              <button
                className="p-2 rounded-full shadow-lg border border-primary bg-[rgba(255,255,255,0.87)] dark:bg-[#1b1f23b2] hover:bg-blue-800 backdrop-blur-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                <img
                  src="/arrow.gif"
                  alt="Back"
                  className="h-8 w-8 object-contain rounded-full"
                />
              </button>
            </Link>
          </div>

          {/* Add Group Expense Drawer */}
          <AddGroupExpense
            open={showAddGroupExpense}
            setOpen={setShowAddGroupExpense}
            groupId={id}
            onAddTransaction={handleAddTransaction}
          />

          {/* Set Group Budget Drawer */}
          <SetGroupBudget
            open={showSetBudget}
            setOpen={setShowSetBudget}
            groupId={id}
            currentBudget={groupDetails.budget || 0}
            onBudgetUpdate={handleBudgetUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
