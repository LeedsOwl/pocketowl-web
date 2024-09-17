import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const GroupVoting = ({ groupId }) => {
    const user = useQuery(api.auth.getUser);
    const [votingSession, setVotingSession] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    // const [votes, setVotes] = useState({});

    // const startVotingSession = useMutation(api.voting_sessions.startVotingSession);
    // const castVote = useMutation(api.voting_sessions.castVote);
    // const endVotingSession = useMutation(api.voting_sessions.endVotingSession);

    const groupMembers = useQuery(api.groups.getGroupMembersWithDetails, groupId ? { groupId } : null);
    
    // Fetch the voting session data if the voting session is set
    // const votingData = votingSession?._id
    //     ? useQuery(api.voting_sessions.getVotingSession, { sessionId: votingSession._id })
    //     : null;

    // useEffect(() => {
    //     if (votingData && votingData.timerEnd) {
    //         const interval = setInterval(() => {
    //             const timeLeft = votingData.timerEnd - Date.now();
    //             console.log("Time left:", timeLeft);
    //             setRemainingTime(timeLeft > 0 ? timeLeft / 1000 : 0);
    //             if (timeLeft <= 0) {
    //                 clearInterval(interval);
    //                 endVotingSession({ sessionId: votingSession._id });
    //             }
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     }
    // }, [votingData, votingSession, endVotingSession]);

    // useEffect(() => {
    //     console.log("Voting session state:", votingSession); // Check if the voting session is set
    //     if (votingSession && votingSession._id) {
    //         const votingData = useQuery(api.voting_sessions.getVotingSession, { sessionId: votingSession._id });
    //         console.log("Fetched voting data:", votingData); // Log the voting data being fetched
    //     }
    // }, [votingSession]);

    useEffect(() => {
        if (votingData && votingData.timerEnd) {
            console.log("Voting timer end:", votingData.timerEnd); // Ensure this value exists
            const interval = setInterval(() => {
                const timeLeft = votingData.timerEnd - Date.now();
                console.log("Time left:", timeLeft); // Log time left to ensure the calculation is correct
                setRemainingTime(timeLeft > 0 ? timeLeft / 1000 : 0);
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    endVotingSession({ sessionId: votingSession._id });
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [votingData, endVotingSession]);



    const handleStartVoting = async () => {
        try {
            const newVotingSession = await startVotingSession({ groupId, timerDuration: 60 });
            console.log("Voting session started:", newVotingSession); 
            setVotingSession(newVotingSession);
        } catch (error) {
            console.error("Error starting voting session:", error);
        }
    };

    const handleVote = async (memberId) => {
        try {
            const currentUserId = user?._id;

            if (!votingSession || !votingSession._id) {
                console.error("No active voting session.");
                return;
            }

            if (!currentUserId) {
                console.error("User is not authenticated.");
                return;
            }

            await castVote({
                sessionId: votingSession._id,
                voterId: currentUserId,
                votedMemberId: memberId,
            });
        } catch (error) {
            console.error("Error casting vote:", error);
        }
    };

    return (
        <div>
            <h2>Vote for the Budget Setter</h2>
            {!votingSession && <button onClick={handleStartVoting}>Start Voting</button>}

            {remainingTime !== null && <p>Time remaining: {Math.round(remainingTime)} seconds</p>}

            {groupMembers && (
                <ul>
                    {groupMembers.map((member) => (
                        <li key={member._id}>
                            {member.user?.name || "Unknown"} <button onClick={() => handleVote(member._id)}>Vote</button>
                        </li>
                    ))}
                </ul>
            )}

            {votingData?.winner && <p>{votingData.winner} is selected to set the budget!</p>}
        </div>
    );
};

export default GroupVoting;
