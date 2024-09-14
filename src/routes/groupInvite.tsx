import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams
import { Id } from "convex/_generated/dataModel"; // Import Id type

const GroupInvite = () => {
  const { groupId } = useParams(); // Get groupId from the URL
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const getInvite = useMutation(api.group_invites.getInvite);

  const handleGenerateInvite = async () => {
    try {
      setLoading(true);
      // Cast the string `groupId` to Id<"groups">
      const invite = await getInvite({ group_id: groupId as Id<"groups"> }); // Type-casting to Id<"groups">
      
      if (invite) {
        setInviteToken(invite.invite_token);
        setInviteLink(`${window.location.origin}/groups/invite/${invite.invite_token}`);
      } else {
        console.error("Failed to generate invite.");
      }
    } catch (err) {
      console.error("Error generating invite:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Group Invite</h1>

      {/* Button to generate the invite */}
      <motion.button
        onClick={handleGenerateInvite}
        className="bg-blue-500 text-white py-2 px-4 rounded"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Invite"}
      </motion.button>

      {/* Display the invite link */}
      {inviteToken && (
        <div className="mt-4">
          <p className="text-lg">Your Invite Link:</p>
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-sm">{inviteLink}</span>
            <motion.button
              onClick={copyToClipboard}
              className="ml-2 bg-blue-500 text-white py-1 px-3 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Copy
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInvite;
