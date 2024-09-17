import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Start a voting session
export const startVotingSession = mutation(async ({ db }, { groupId, timerDuration }) => {
    const groupMembers = await db.query("group_members").withIndex("by_group_id", q => q.eq("group_id", groupId)).collect();
    if (groupMembers.length === 0) throw new Error("No members in the group");

    const votingSession = {
        groupId,
        votes: {},
        timerEnd: Date.now() + timerDuration * 1000,
    };
    const insertedSession = await db.insert("voting_sessions", votingSession);
    console.log("Inserted voting session:", insertedSession); 
    return insertedSession;
});

// Cast a vote
export const castVote = mutation(async ({ db }, { sessionId, voterId, votedMemberId }) => {
    const votingSession = await db.get(sessionId);
    if (!votingSession) throw new Error("Voting session not found");

    votingSession.votes[voterId] = votedMemberId;
    await db.replace(sessionId, votingSession);
});

// End the voting session and declare a winner
export const endVotingSession = mutation(async ({ db }, { sessionId }) => {
    const votingSession = await db.get(sessionId);
    if (!votingSession) throw new Error("Voting session not found");

    const voteCounts = {};
    Object.values(votingSession.votes).forEach((votedMemberId) => {
        voteCounts[votedMemberId] = (voteCounts[votedMemberId] || 0) + 1;
    });

    const winner = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
    await db.patch(sessionId, { winner });

    return { winner };
});

// Get the current voting session data
export const getVotingSession = query(async ({ db }, { sessionId }) => {
    return await db.get(sessionId);
});
