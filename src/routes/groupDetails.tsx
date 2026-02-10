import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import AddGroupExpense from "@/components/add-group-expense";
import GroupTransaction from "@/components/group-transactions";
import EqualSplit from "@/components/EqualSplit";
import PercentageSplit from "@/components/PercentageSplit";
import CustomSplit from "@/components/CustomSplit";
import { Progress } from "@/components/ui/progress";
import SetGroupBudget from "@/components/set-group-budget";
import { LoadingSpinner } from "@/components/ui/loading-animations";
import { LuSparkles, LuUsers, LuUserPlus, LuWallet, LuArrowLeft } from "react-icons/lu";
import { PageTransition } from "@/components/PageTransition";

type SplitMode = "equal" | "percentage" | "shares" | "fixed" | "custom";
const GBP = "\u00A3";

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const groupId = id as Id<"groups"> | undefined;

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
    }
  }, [groupId, navigate]);

  const groupDetails = useQuery(
    api.groups.getGroupDetails,
    groupId ? { groupId } : "skip"
  );
  const groupMembers =
    useQuery(
      api.groups.getGroupMembersWithDetails,
      groupId ? { groupId } : "skip"
    ) || [];
  const userInfo = useQuery(api.users.getUserInfo, {});
  const groupTransactions =
    useQuery(
      api.group_transactions.getGroupTransactions,
      groupId ? { groupId } : "skip"
    ) || [];

  const createInvite = useMutation(api.group_invites.createInvite);
  const updateGroupSplitConfig = useMutation(api.groups.updateGroupSplitConfig);
  const setGroupBudget = useMutation(api.budget.setGroupBudget);

  const [showSetBudget, setShowSetBudget] = useState(false);
  const [showAddGroupExpense, setShowAddGroupExpense] = useState(false);
  const [showSplitSettings, setShowSplitSettings] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [splitSaveError, setSplitSaveError] = useState("");
  const [splitSaveHint, setSplitSaveHint] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const [percentageInputs, setPercentageInputs] = useState<Record<string, string>>({});
  const [shareInputs, setShareInputs] = useState<Record<string, string>>({});
  const [fixedInputs, setFixedInputs] = useState<Record<string, string>>({});

  const isCreator = userInfo?._id === groupDetails?.created_by;
  const memberIds = groupMembers.map((member) => member._id);

  const totalAmount = useMemo(
    () => groupTransactions.reduce((acc, transaction) => acc + transaction.amount, 0),
    [groupTransactions]
  );

  const groupBudget = groupDetails?.budget || 0;
  const progressPercentage = groupBudget > 0 ? (totalAmount / groupBudget) * 100 : 0;
  const splitBaseAmount = totalAmount > 0 ? totalAmount : groupBudget;

  const existingPercentageMap = useMemo(() => {
    const map: Record<string, number> = {};
    const raw = groupDetails?.default_split_percentages;
    if (Array.isArray(raw)) {
      raw.forEach((split) => {
        if (split?.group_member_id && typeof split.percentage === "number") {
          map[split.group_member_id] = split.percentage;
        }
      });
    } else if (
      raw &&
      typeof raw === "object" &&
      raw.group_member_id &&
      typeof raw.percentage === "number"
    ) {
      map[raw.group_member_id] = raw.percentage;
    }
    return map;
  }, [groupDetails?.default_split_percentages]);

  const customSplitData = useMemo(() => {
    const memberAmounts: Record<string, number> = {};
    groupMembers.forEach((member) => {
      memberAmounts[member._id] = 0;
    });

    groupTransactions.forEach((transaction) => {
      const matchedMember = groupMembers.find(
        (member) => member.user?.name === transaction.user_name
      );
      if (matchedMember) {
        memberAmounts[matchedMember._id] += transaction.amount || 0;
      }
    });

    return memberAmounts;
  }, [groupMembers, groupTransactions]);

  useEffect(() => {
    if (!showSplitSettings || groupMembers.length === 0) {
      return;
    }

    const normalizedType = ["equal", "percentage", "custom", "shares", "fixed"].includes(
      groupDetails?.default_split_type || "equal"
    )
      ? ((groupDetails?.default_split_type || "equal") as SplitMode)
      : "equal";
    setSplitMode(normalizedType);

    const defaultPercentage = 100 / groupMembers.length;
    const nextPercentages: Record<string, string> = {};
    const nextShares: Record<string, string> = {};
    const nextFixed: Record<string, string> = {};

    groupMembers.forEach((member) => {
      const memberPercentage = existingPercentageMap[member._id] ?? defaultPercentage;
      const clamped = Math.max(0, Math.min(100, memberPercentage));
      nextPercentages[member._id] = clamped.toFixed(2);
      nextShares[member._id] = clamped.toFixed(2);
      nextFixed[member._id] = ((splitBaseAmount * clamped) / 100).toFixed(2);
    });

    setPercentageInputs(nextPercentages);
    setShareInputs(nextShares);
    setFixedInputs(nextFixed);
    setSplitSaveError("");
    setSplitSaveHint("");
  }, [
    showSplitSettings,
    groupMembers,
    groupDetails?.default_split_type,
    existingPercentageMap,
    splitBaseAmount,
  ]);

  const handleInvite = async () => {
    try {
      const invite = await createInvite({
        group_id: groupDetails?._id as Id<"groups">,
      });
      setInviteLink(`${window.location.origin}/invite/${invite.invite_token}`);
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };

  const parseAmount = (value: string) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const normalizePercentages = (
    percentages: Array<{ group_member_id: Id<"group_members">; percentage: number }>
  ) => {
    const total = percentages.reduce((sum, p) => sum + p.percentage, 0);
    if (total <= 0) {
      return percentages.map((p) => ({ ...p, percentage: 0 }));
    }

    const scaled = percentages.map((p) => ({
      ...p,
      percentage: (p.percentage / total) * 100,
    }));

    const rounded = scaled.map((p) => ({
      ...p,
      percentage: Math.round(p.percentage * 100) / 100,
    }));
    const roundedTotal = rounded.reduce((sum, p) => sum + p.percentage, 0);
    const diff = Math.round((100 - roundedTotal) * 100) / 100;
    if (rounded.length > 0) {
      rounded[rounded.length - 1].percentage = Math.max(
        0,
        Math.round((rounded[rounded.length - 1].percentage + diff) * 100) / 100
      );
    }
    return rounded;
  };

  const handlePercentageInputChange = (memberId: string, rawValue: string) => {
    setPercentageInputs((prev) => {
      if (!memberIds.includes(memberId)) {
        return prev;
      }

      const nextNumbers: Record<string, number> = {};
      memberIds.forEach((idValue) => {
        nextNumbers[idValue] = Math.max(0, Math.min(100, parseAmount(prev[idValue] ?? "0")));
      });
      nextNumbers[memberId] = Math.max(0, Math.min(100, parseAmount(rawValue)));

      const otherIds = memberIds.filter((idValue) => idValue !== memberId);
      if (otherIds.length === 0) {
        nextNumbers[memberId] = 100;
      } else {
        const remaining = Math.max(0, 100 - nextNumbers[memberId]);
        const otherTotal = otherIds.reduce((sum, idValue) => sum + nextNumbers[idValue], 0);

        if (otherTotal > 0) {
          otherIds.forEach((idValue) => {
            nextNumbers[idValue] = (nextNumbers[idValue] / otherTotal) * remaining;
          });
        } else {
          const equalShare = remaining / otherIds.length;
          otherIds.forEach((idValue) => {
            nextNumbers[idValue] = equalShare;
          });
        }
      }

      memberIds.forEach((idValue) => {
        nextNumbers[idValue] = Math.round(nextNumbers[idValue] * 100) / 100;
      });
      const total = memberIds.reduce((sum, idValue) => sum + nextNumbers[idValue], 0);
      const diff = Math.round((100 - total) * 100) / 100;
      const adjustId = memberIds[memberIds.length - 1];
      nextNumbers[adjustId] = Math.max(
        0,
        Math.round((nextNumbers[adjustId] + diff) * 100) / 100
      );

      const nextInputs: Record<string, string> = {};
      memberIds.forEach((idValue) => {
        nextInputs[idValue] = nextNumbers[idValue].toFixed(2);
      });
      return nextInputs;
    });
    setSplitSaveError("");
  };

  const previewSplits = useMemo(() => {
    const map: Record<string, { percentage: number; amount: number }> = {};
    if (groupMembers.length === 0) {
      return map;
    }

    if (splitMode === "equal") {
      const each = 100 / groupMembers.length;
      groupMembers.forEach((member) => {
        map[member._id] = {
          percentage: each,
          amount: (splitBaseAmount * each) / 100,
        };
      });
      return map;
    }

    if (splitMode === "custom") {
      const rawTotal = groupMembers.reduce(
        (sum, member) => sum + (customSplitData[member._id] || 0),
        0
      );
      groupMembers.forEach((member) => {
        const raw = customSplitData[member._id] || 0;
        const percentage = rawTotal > 0 ? (raw / rawTotal) * 100 : 100 / groupMembers.length;
        map[member._id] = {
          percentage,
          amount: (splitBaseAmount * percentage) / 100,
        };
      });
      return map;
    }

    if (splitMode === "percentage") {
      groupMembers.forEach((member) => {
        const percentage = Math.max(
          0,
          Math.min(100, parseAmount(percentageInputs[member._id] ?? "0"))
        );
        map[member._id] = {
          percentage,
          amount: (splitBaseAmount * percentage) / 100,
        };
      });
      return map;
    }

    if (splitMode === "shares") {
      const totalShares = groupMembers.reduce(
        (sum, member) => sum + Math.max(0, parseAmount(shareInputs[member._id] ?? "0")),
        0
      );
      groupMembers.forEach((member) => {
        const shares = Math.max(0, parseAmount(shareInputs[member._id] ?? "0"));
        const percentage = totalShares > 0 ? (shares / totalShares) * 100 : 0;
        map[member._id] = {
          percentage,
          amount: (splitBaseAmount * percentage) / 100,
        };
      });
      return map;
    }

    const totalFixed = groupMembers.reduce(
      (sum, member) => sum + Math.max(0, parseAmount(fixedInputs[member._id] ?? "0")),
      0
    );
    const normalizationBase = splitBaseAmount > 0 ? splitBaseAmount : totalFixed;
    const scale =
      normalizationBase > 0 && totalFixed > 0 ? normalizationBase / totalFixed : 0;
    groupMembers.forEach((member) => {
      const fixedAmount = Math.max(0, parseAmount(fixedInputs[member._id] ?? "0"));
      const adjustedAmount = fixedAmount * scale;
      const percentage = normalizationBase > 0 ? (adjustedAmount / normalizationBase) * 100 : 0;
      map[member._id] = {
        percentage,
        amount: adjustedAmount,
      };
    });
    return map;
  }, [
    customSplitData,
    fixedInputs,
    groupMembers,
    percentageInputs,
    shareInputs,
    splitBaseAmount,
    splitMode,
  ]);

  const buildPercentagesForSave = () => {
    const emptyResult = {
      percentages: undefined as
        | Array<{ group_member_id: Id<"group_members">; percentage: number }>
        | undefined,
      error: "",
      hint: "",
    };

    if (splitMode === "equal" || splitMode === "custom") {
      return emptyResult;
    }

    if (splitMode === "percentage") {
      const list = groupMembers.map((member) => ({
        group_member_id: member._id as Id<"group_members">,
        percentage: Math.max(0, parseAmount(percentageInputs[member._id] ?? "0")),
      }));
      return { ...emptyResult, percentages: normalizePercentages(list) };
    }

    if (splitMode === "shares") {
      const totalShares = groupMembers.reduce(
        (sum, member) => sum + Math.max(0, parseAmount(shareInputs[member._id] ?? "0")),
        0
      );
      if (totalShares <= 0) {
        return {
          ...emptyResult,
          error: "Enter at least one positive share value.",
        };
      }
      const list = groupMembers.map((member) => ({
        group_member_id: member._id as Id<"group_members">,
        percentage:
          (Math.max(0, parseAmount(shareInputs[member._id] ?? "0")) / totalShares) * 100,
      }));
      return { ...emptyResult, percentages: normalizePercentages(list) };
    }

    const rawAmounts = groupMembers.map((member) =>
      Math.max(0, parseAmount(fixedInputs[member._id] ?? "0"))
    );
    const rawTotal = rawAmounts.reduce((sum, amount) => sum + amount, 0);
    if (rawTotal <= 0) {
      return {
        ...emptyResult,
        error: "Enter at least one positive fixed amount.",
      };
    }
    if (splitBaseAmount <= 0) {
      return {
        ...emptyResult,
        error: "Set a budget or add expenses before saving a fixed-amount split.",
      };
    }

    const scale = splitBaseAmount / rawTotal;
    const list = groupMembers.map((member, index) => ({
      group_member_id: member._id as Id<"group_members">,
      percentage: ((rawAmounts[index] * scale) / splitBaseAmount) * 100,
    }));
    return {
      ...emptyResult,
      percentages: normalizePercentages(list),
      hint:
        Math.abs(rawTotal - splitBaseAmount) > 0.01
          ? `Fixed amounts were proportionally adjusted to match ${GBP}${splitBaseAmount.toFixed(2)}.`
          : "",
    };
  };

  const handleSaveSplitSettings = async () => {
    setSplitSaveError("");
    setSplitSaveHint("");
    try {
      const result = buildPercentagesForSave();
      if (result.error) {
        setSplitSaveError(result.error);
        return;
      }
      if (result.hint) {
        setSplitSaveHint(result.hint);
      }

      await updateGroupSplitConfig({
        groupId: groupId as Id<"groups">,
        splitType: splitMode,
        splitPercentages: result.percentages,
      });
      setShowSplitSettings(false);
    } catch (error) {
      console.error("Error saving split settings:", error);
      setSplitSaveError("Failed to save split settings. Please try again.");
    }
  };

  const handleBudgetUpdate = async (newBudget: number) => {
    try {
      if (!groupId) return;
      await setGroupBudget({ groupId, budget: newBudget });
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleAddGroupExpenseButtonClick = () => {
    setShowAddGroupExpense(!showAddGroupExpense);
  };

  const handleAddTransaction = () => {
    // Query already keeps this list in sync, no local cache patching required.
  };

  const splitTypeTitle =
    groupDetails?.default_split_type === "shares"
      ? "Shares Split"
      : groupDetails?.default_split_type === "fixed"
        ? "Fixed Amount Split"
        : "Percentage Split";

  const splitTypeSubtitle =
    groupDetails?.default_split_type === "shares"
      ? "Derived from share units per member."
      : groupDetails?.default_split_type === "fixed"
        ? "Derived from fixed amount targets."
        : undefined;

  if (!groupId || groupDetails === undefined) {
    return (
      <div className="tab-page grid min-h-[calc(100vh-10rem)] place-items-center">
        <div className="flex flex-col items-center gap-3 text-white/75">
          <LoadingSpinner />
          <p className="text-sm">Loading group details...</p>
        </div>
      </div>
    );
  }
  if (!groupDetails) {
    return (
      <div className="tab-page grid min-h-[calc(100vh-10rem)] place-items-center">
        <p className="text-white/75">Group not found.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-[#8fb8a0]/12 blur-3xl"
              animate={{ x: [0, 20, -10, 0], y: [0, -8, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[-7rem] top-52 h-72 w-72 rounded-full bg-[#6f866f]/14 blur-3xl"
              animate={{ x: [0, -14, 8, 0], y: [0, 10, -8, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="surface-card relative overflow-hidden rounded-3xl border-white/20 p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -left-16 top-[-28%] h-60 w-60 rounded-full bg-[#8fb8a0]/16 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 bottom-[-36%] h-64 w-64 rounded-full bg-[#6f866f]/16 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(255,255,255,0.09),transparent_44%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                <LuSparkles className="h-3.5 w-3.5 text-[#9eb89f]" />
                Group Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-white/95 sm:text-4xl">
                {groupDetails.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65 sm:text-base">
                {groupDetails.description || "Keep everyone aligned with transparent split rules and live spending."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">Members</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{groupMembers.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">Expenses</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{groupTransactions.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">Spent</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{GBP}{totalAmount.toFixed(0)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">Budget</p>
                  <p className="mt-1 text-2xl font-semibold text-[#a8c1aa]">
                    {groupBudget > 0 ? `${GBP}${groupBudget.toFixed(0)}` : "Not set"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link to="/groups">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-[#0b1018] text-white hover:border-[#9eb89f] hover:bg-[#101826]"
                  >
                    <LuArrowLeft className="mr-2 h-4 w-4" />
                    Back to Groups
                  </Button>
                </Link>
                <Button
                  onClick={handleAddGroupExpenseButtonClick}
                  className="bg-primary text-white hover:bg-[#5f735f]"
                >
                  <FaPlus className="mr-2 h-4 w-4" />
                  Add Group Expense
                </Button>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-3 xl:grid-cols-[0.95fr_1.25fr]">
            <div className="space-y-3">
              <section className="surface-card rounded-2xl border-white/20 p-4 sm:p-5">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white/95">
                  <LuUsers className="h-5 w-5 text-[#9eb89f]" />
                  Group Members
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {groupMembers.map((member) => (
                    <li
                      key={member._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#161f1a] text-sm font-bold text-white">
                          {member.user?.name ? member.user.name[0] : "?"}
                        </div>
                        <span className="truncate text-sm font-medium text-white/90 sm:text-base">
                          {member.user?.name || "Unknown User"}
                        </span>
                      </div>
                      {member.user_id === groupDetails.created_by && (
                        <img
                          src="/crown.gif"
                          alt="Creator"
                          className="h-6 w-6 shrink-0 rounded-full border border-primary"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="surface-card rounded-2xl border-white/20 p-4 sm:p-5">
                <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white/95">
                  <LuUserPlus className="h-5 w-5 text-[#9eb89f]" />
                  Invite People
                </h2>
                <p className="mt-1 text-sm text-white/65">Generate a shareable link for this group.</p>
                <Button variant="default" className="mt-4 w-full py-3" onClick={handleInvite}>
                  <FaPlus className="mr-2" /> Invite friends/family
                </Button>

                {inviteLink && (
                  <div className="mt-4 rounded-xl border border-white/12 bg-black/25 p-3">
                    <p className="mb-2 text-xs uppercase tracking-[0.12em] text-white/55">Invite Link</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="h-10 flex-1 rounded-lg border border-white/15 bg-[#0b1018] px-3 text-sm text-white/90"
                      />
                      <Button
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(inviteLink)}
                        className="sm:w-auto"
                      >
                        Copy link
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-3">
              <section className="surface-card rounded-2xl border-white/20 p-4 pb-2 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white/95">
                    <LuWallet className="h-5 w-5 text-[#9eb89f]" />
                    Total Expenses
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSetBudget(true)}
                    className="ml-2"
                  >
                    <FaPencilAlt className="mr-1" /> Set Budget
                  </Button>
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                  <p className="text-lg font-bold text-white">
                    Total: {GBP}{totalAmount.toFixed(2)}{" "}
                    {groupBudget > 0 && (
                      <>
                        / {GBP}{groupBudget.toFixed(2)}
                      </>
                    )}
                  </p>
                  <div className="mt-2">
                    {groupBudget > 0 ? (
                      <Progress value={progressPercentage} className="w-full" />
                    ) : (
                      <p className="text-sm text-white/65">
                        No budget set. Click "Set Budget" to add one.
                      </p>
                    )}
                  </div>
                </div>

                {isCreator && (
                  <div className="mt-3 px-1">
                    <Button variant="outline" size="sm" onClick={() => setShowSplitSettings(true)}>
                      Open Split Settings
                    </Button>
                  </div>
                )}

                <div className="mt-3">
                  {groupDetails.default_split_type === "equal" && (
                    <EqualSplit totalAmount={splitBaseAmount} groupMembers={groupMembers} />
                  )}
                  {(groupDetails.default_split_type === "percentage" ||
                    groupDetails.default_split_type === "shares" ||
                    groupDetails.default_split_type === "fixed") && (
                    <PercentageSplit
                      totalAmount={splitBaseAmount}
                      groupMembers={groupMembers}
                      splitPercentages={groupDetails.default_split_percentages}
                      title={splitTypeTitle}
                      subtitle={splitTypeSubtitle}
                    />
                  )}
                  {groupDetails.default_split_type === "custom" && (
                    <CustomSplit
                      totalAmount={splitBaseAmount}
                      groupMembers={groupMembers}
                      customSplitData={customSplitData}
                    />
                  )}
                </div>
              </section>

              <section className="surface-card rounded-2xl border-white/20 p-4 sm:p-5">
                <h2 className="text-xl font-semibold text-white/95">Transactions</h2>
                <p className="mt-1 text-sm text-white/60">
                  Every member can log what they spent using the Add Group Expense button above.
                </p>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/15 p-2">
                  {groupTransactions.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-white/60">
                      No transactions yet. Add the first one using the floating action button.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {groupTransactions.map((transaction) => (
                        <GroupTransaction
                          key={transaction._id}
                          groupId={transaction.group_id}
                          description={transaction.description}
                          amount={transaction.amount}
                          date={new Date(transaction.dateTime)}
                          initiatedBy={transaction.user_name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <AddGroupExpense
            open={showAddGroupExpense}
            setOpen={setShowAddGroupExpense}
            groupId={groupId}
            onAddTransaction={handleAddTransaction}
          />

          <SetGroupBudget
            open={showSetBudget}
            setOpen={setShowSetBudget}
            groupId={groupId}
            currentBudget={groupDetails.budget || 0}
            onBudgetUpdate={handleBudgetUpdate}
          />

          <Drawer open={showSplitSettings} onOpenChange={setShowSplitSettings}>
            <DrawerContent>
              <DrawerHeader className="sm:text-center">
                <DrawerTitle className="text-2xl">Split Settings</DrawerTitle>
                <DrawerDescription>
                  Choose a split method and adjust values with a live preview.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 pb-0 space-y-4">
                <div className="grid gap-2">
                  <Label>Split Method</Label>
                  <Select value={splitMode} onValueChange={(value) => setSplitMode(value as SplitMode)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select split method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal Split</SelectItem>
                      <SelectItem value="percentage">Percentage Split</SelectItem>
                      <SelectItem value="shares">Shares / Units Split</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Targets</SelectItem>
                      <SelectItem value="custom">Activity-Based (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {splitMode === "percentage" && (
                  <p className="text-sm text-muted-foreground">
                    Editing one percentage auto-adjusts the others to keep total at 100.
                  </p>
                )}
                {splitMode === "shares" && (
                  <p className="text-sm text-muted-foreground">
                    Enter relative shares (e.g. 1, 2, 3). We convert shares into percentages.
                  </p>
                )}
                {splitMode === "fixed" && (
                  <p className="text-sm text-muted-foreground">
                    Enter target amounts by member. If totals differ from the split base, we scale
                    them proportionally.
                  </p>
                )}
                {splitMode === "custom" && (
                  <p className="text-sm text-muted-foreground">
                    Activity-based split uses member contribution history from group transactions.
                  </p>
                )}

                {(splitMode === "percentage" || splitMode === "shares" || splitMode === "fixed") &&
                  groupMembers.map((member) => (
                    <div key={member._id} className="grid gap-2">
                      <Label htmlFor={`${splitMode}-${member._id}`}>
                        {member.user?.name || "Unknown User"}
                      </Label>
                      <Input
                        id={`${splitMode}-${member._id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          splitMode === "percentage"
                            ? percentageInputs[member._id] ?? ""
                            : splitMode === "shares"
                              ? shareInputs[member._id] ?? ""
                              : fixedInputs[member._id] ?? ""
                        }
                        onChange={(e) => {
                          if (splitMode === "percentage") {
                            handlePercentageInputChange(member._id, e.target.value);
                          } else if (splitMode === "shares") {
                            setShareInputs((prev) => ({
                              ...prev,
                              [member._id]: e.target.value,
                            }));
                            setSplitSaveError("");
                          } else {
                            setFixedInputs((prev) => ({
                              ...prev,
                              [member._id]: e.target.value,
                            }));
                            setSplitSaveError("");
                          }
                        }}
                      />
                    </div>
                  ))}

                <div className="rounded-md border p-3">
                  <p className="text-sm font-medium mb-2">
                    Live Preview (Base: {GBP}{splitBaseAmount.toFixed(2)})
                  </p>
                  <div className="space-y-1">
                    {groupMembers.map((member) => {
                      const preview = previewSplits[member._id] || { percentage: 0, amount: 0 };
                      return (
                        <div
                          key={`preview-${member._id}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{member.user?.name || "Unknown User"}</span>
                          <span>
                            {preview.percentage.toFixed(2)}% | {GBP}{preview.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {splitSaveHint && <p className="text-sm text-amber-600">{splitSaveHint}</p>}
                {splitSaveError && <p className="text-sm text-red-500">{splitSaveError}</p>}
              </div>

              <DrawerFooter>
                <Button onClick={handleSaveSplitSettings}>Save Split Settings</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </PageTransition>
  );
}

export default GroupDetails;
