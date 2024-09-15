import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  user_settings: defineTable({
    user_id: v.id("users"),
    currency: v.string(),
  }),
  transactions: defineTable({
    user_id: v.id("users"),
    dateTime: v.string(),
    description: v.string(),
    amount: v.number(),
    category: v.id("categories"),
  }),
  categories: defineTable({
    value: v.string(),
    friendly_name: v.string(),
  }),
  groups: defineTable({
    name: v.string(),
    created_by: v.id("users"),
    description: v.string(),
    default_split_type: v.string(),
    default_split_percentages: v.optional(v.object({
      group_member_id: v.id("group_members"),
      percentage: v.float64(),
    })),
    budget: v.optional(v.number()),
  }),
  group_members: defineTable({
    group_id: v.id("groups"),
    user_id: v.id("users"),
    invite_accepted: v.boolean(),
  }),
  group_invites: defineTable({
    group_id: v.id("groups"),
    invited_by: v.id("users"), 
    invite_token: v.string(),  
    expiry_date: v.string(),
    created_at: v.string(),
  }),
  group_transactions: defineTable({
    group_id: v.id("groups"),
    description: v.string(),
    amount: v.number(),
    dateTime: v.string(),
    user_name: v.string(),
  }).index("by_group_id", ["group_id"]),
  user_financial_data: defineTable({
    user_id: v.id("users"),
    account_balance: v.number(),
    income: v.number(),
    income_type: v.optional(v.string()),
  }),
});

export default schema;
