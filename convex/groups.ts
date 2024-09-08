import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setGroup = mutation({
  args: {
    name: v.string(),
    created_by: v.id("users"),
    description: v.string(),
    default_split_type: v.string(),
    default_split_percentages: v.object({
      group_member_id: v.id("group_members"),
      percentage: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { name, created_by, description, default_split_type, default_split_percentages } = args;

    // Insert the new group into the "groups" table
    const groupId = await ctx.db.insert("groups", {
      name,
      created_by,
      description,
      default_split_type,
      default_split_percentages: default_split_percentages || {}, // Optional field
    });

    return groupId; // Return the created group ID
  },
});
