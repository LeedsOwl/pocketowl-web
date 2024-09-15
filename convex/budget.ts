import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setGroupBudget = mutation({
    args: { groupId: v.id("groups"), budget: v.number() },
    handler: async ({ db }, { groupId, budget }) => {
      await db.patch(groupId, { budget });
    },
  });
  