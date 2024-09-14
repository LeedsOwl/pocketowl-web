import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "convex/_generated/dataModel";

export const addGroupTransaction = mutation(
  async ({ db }, { groupId, description, amount, dateTime, user_name }) => {
    // Ensure the essential fields are present
    if (!groupId || !description || !amount || !dateTime || !user_name) {
      throw new Error("Missing required fields");
    }

    // Create the transaction object
    const newTransaction = {
      group_id: groupId,
      description: description,
      amount: amount, // Should be a number
      dateTime: dateTime, // ISO string format
      user_name: user_name, // The user who initiated the transaction
    };

    // Insert the new transaction into the database
    const transactionId = await db.insert("group_transactions", newTransaction);

    return { transactionId, ...newTransaction };
  }
);

export const getGroupTransactions = query(async ({ db }, { groupId }) => {
    if (!groupId) {
      throw new Error("groupId is required");
    }
  
    console.log("Received groupId:", groupId);
  
    // Fetch transactions for the given group
    const transactions = await db
      .table("group_transactions")
      .filter((q) => q.eq(q.field("group_id"), groupId))
      .order("desc", "dateTime")
      .collect();
  
    return transactions;
  });