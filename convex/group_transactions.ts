import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const addGroupTransaction = mutation(async ({ db }, { groupId, description, amount, dateTime, user_name }) => {
  if (!groupId || !description || !amount || !dateTime || !user_name) {
    throw new Error("Missing required fields");
  }

  const newTransaction = {
    group_id: groupId,
    description,
    amount,
    dateTime,
    user_name,
  };

  await db.insert("group_transactions", newTransaction);
  return newTransaction;
});

export const getGroupTransactions = query(async ({ db }, { groupId }) => {
  if (!groupId) {
    throw new Error("groupId is required");
  }

  // Fetch transactions from the group_transactions table
  const transactions = await db.query("group_transactions")
    .withIndex("by_group_id", q => q.eq("group_id", groupId))  // Use the correct index for group_id
    .order("desc", "dateTime")
    .collect();

  return transactions;
});