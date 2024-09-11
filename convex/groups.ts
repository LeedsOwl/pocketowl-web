import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server"; 

export const setGroup = mutation({
  args: {
    name: v.string(),
    created_by: v.id("users"),
    description: v.string(),
    default_split_type: v.string(),
    default_split_percentages: v.optional(v.object({
      group_member_id: v.optional(v.id("group_members")),
      percentage: v.optional(v.float64()),
    })),
  },
  handler: async (ctx, args) => {
    const { name, created_by, description, default_split_type, default_split_percentages } = args;

    const groupData: any = {
      name,
      created_by,
      description,
      default_split_type,
    };

    if (default_split_percentages && default_split_percentages.group_member_id) {
      groupData.default_split_percentages = default_split_percentages;
    }

    const groupId = await ctx.db.insert("groups", groupData);

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

