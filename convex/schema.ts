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
});
 
export default schema;