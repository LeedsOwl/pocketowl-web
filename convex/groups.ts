import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const setGroup = mutation({
  args: {
    name: v.string(),
    created_by: v.id("users"),
    description: v.string(),
    default_split_type: v.string(),
    default_split_percentages: v.optional(
      v.union(
        v.object({
          group_member_id: v.optional(v.id("group_members")),
          percentage: v.optional(v.float64()),
        }),
        v.array(
          v.object({
            group_member_id: v.id("group_members"),
            percentage: v.float64(),
          })
        )
      )
    ),
  },
  handler: async (ctx, args) => {
    const {
      name,
      created_by,
      description,
      default_split_type,
      default_split_percentages,
    } = args;

    const groupData: any = {
      name,
      created_by,
      description,
      default_split_type,
    };

    if (Array.isArray(default_split_percentages) && default_split_percentages.length > 0) {
      groupData.default_split_percentages = default_split_percentages;
    } else if (
      default_split_percentages &&
      !Array.isArray(default_split_percentages) &&
      default_split_percentages.group_member_id
    ) {
      groupData.default_split_percentages = default_split_percentages;
    }

    const groupId = await ctx.db.insert("groups", groupData);

    await ctx.db.insert("group_members", {
      group_id: groupId,
      user_id: created_by,
      invite_accepted: true,
    });

    return groupId;
  },
});

export const updateGroupSplitPercentages = mutation({
  args: {
    groupId: v.id("groups"),
    splitPercentages: v.array(
      v.object({
        group_member_id: v.id("group_members"),
        percentage: v.float64(),
      })
    ),
  },
  handler: async (ctx, { groupId, splitPercentages }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.created_by !== userId) {
      throw new Error("Only the group creator can update split percentages.");
    }

    if (splitPercentages.length === 0) {
      throw new Error("At least one split percentage is required.");
    }

    const members = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .collect();

    const memberIds = new Set(members.map((m) => m._id));
    const providedIds = new Set<string>();

    for (const split of splitPercentages) {
      if (!memberIds.has(split.group_member_id)) {
        throw new Error("Split percentages include a member not in this group.");
      }
      if (split.percentage < 0) {
        throw new Error("Split percentages cannot be negative.");
      }
      if (providedIds.has(split.group_member_id)) {
        throw new Error("Duplicate member in split percentages.");
      }
      providedIds.add(split.group_member_id);
    }

    if (providedIds.size !== members.length) {
      throw new Error("Split percentages must include every group member.");
    }

    const total = splitPercentages.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new Error("Split percentages must total 100.");
    }

    await ctx.db.patch(groupId, {
      default_split_type: "percentage",
      default_split_percentages: splitPercentages,
    });

    return { success: true };
  },
});

export const updateGroupSplitConfig = mutation({
  args: {
    groupId: v.id("groups"),
    splitType: v.string(),
    splitPercentages: v.optional(
      v.array(
        v.object({
          group_member_id: v.id("group_members"),
          percentage: v.float64(),
        })
      )
    ),
  },
  handler: async (ctx, { groupId, splitType, splitPercentages }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const allowedTypes = new Set(["equal", "percentage", "custom", "shares", "fixed"]);
    if (!allowedTypes.has(splitType)) {
      throw new Error("Invalid split type.");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.created_by !== userId) {
      throw new Error("Only the group creator can update split settings.");
    }

    if (splitType === "equal" || splitType === "custom") {
      await ctx.db.patch(groupId, {
        default_split_type: splitType,
        default_split_percentages: undefined,
      });
      return { success: true };
    }

    if (!splitPercentages || splitPercentages.length === 0) {
      throw new Error("Split percentages are required for this split type.");
    }

    const members = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .collect();

    const memberIds = new Set(members.map((m) => m._id));
    const providedIds = new Set<string>();

    for (const split of splitPercentages) {
      if (!memberIds.has(split.group_member_id)) {
        throw new Error("Split percentages include a member not in this group.");
      }
      if (split.percentage < 0) {
        throw new Error("Split percentages cannot be negative.");
      }
      if (providedIds.has(split.group_member_id)) {
        throw new Error("Duplicate member in split percentages.");
      }
      providedIds.add(split.group_member_id);
    }

    if (providedIds.size !== members.length) {
      throw new Error("Split percentages must include every group member.");
    }

    const total = splitPercentages.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new Error("Split percentages must total 100.");
    }

    await ctx.db.patch(groupId, {
      default_split_type: splitType,
      default_split_percentages: splitPercentages,
    });

    return { success: true };
  },
});

export const getUserGroups = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("created_by"), userId))
      .order("desc")
      .collect();
  },
});

export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.created_by !== userId) {
      throw new Error("Only the group creator can delete this group.");
    }

    const [members, invites, transactions] = await Promise.all([
      ctx.db
        .query("group_members")
        .withIndex("by_group_id", (q) => q.eq("group_id", groupId))
        .collect(),
      ctx.db
        .query("group_invites")
        .filter((q) => q.eq(q.field("group_id"), groupId))
        .collect(),
      ctx.db
        .query("group_transactions")
        .withIndex("by_group_id", (q) => q.eq("group_id", groupId))
        .collect(),
    ]);

    await Promise.all([
      ...members.map((member) => ctx.db.delete(member._id)),
      ...invites.map((invite) => ctx.db.delete(invite._id)),
      ...transactions.map((transaction) => ctx.db.delete(transaction._id)),
    ]);

    await ctx.db.delete(groupId);

    return { success: true };
  },
});

export const getGroupMembers = query({
  args: {
    groupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    const { groupId } = args;

    if (groupId) {
      return await ctx.db
        .query("group_members")
        .filter((q) => q.eq(q.field("group_id"), groupId))
        .collect();
    } else {
      return await ctx.db.query("group_members").collect();
    }
  },
});

export const getGroupCreatorDetails = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const getGroupDetails = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const { groupId } = args;

    // Fetch the group details
    const group = await ctx.db.get(groupId);

    // Fetch creator's details
    const creator = await ctx.db.get(group.created_by);

    // Fetch group members
    const members = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .collect();

    return {
      ...group,
      members,
      creator, // Include the creator's details
    };
  },
});

export const getGroupMembersWithDetails = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const groupMembers = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .collect();

    const membersWithDetails = await Promise.all(
      groupMembers.map(async (member) => {
        const user = await ctx.db.get(member.user_id);
        return {
          ...member,
          user,
        };
      })
    );

    return membersWithDetails;
  },
});

export const getGroupTransactions = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .collect();

    return transactions;
  },
});

export const addUserToGroup = mutation({
  args: {
    group_id: v.id("groups"),
  },
  handler: async (ctx, { group_id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const userId = user.subject.split("|")[0];
    const existingMember = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), group_id))
      .filter((q) => q.eq(q.field("user_id"), userId))
      .first();

    if (existingMember) {
      throw new Error("User is already a member of this group.");
    }

    await ctx.db.insert("group_members", {
      group_id,
      user_id: userId,
      invite_accepted: true,
    });

    return { success: true };
  },
});
