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
      v.object({
        group_member_id: v.optional(v.id("group_members")),
        percentage: v.optional(v.float64()),
      })
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

    if (
      default_split_percentages &&
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
