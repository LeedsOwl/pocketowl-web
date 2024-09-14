import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function InviteHandler() {
  const { invite_token } = useParams<{ invite_token: string }>(); // Extract the invite token from the URL
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // Check if the user is authenticated
  const userAuth = useQuery(api.auth.getUser);
  console.log("User Auth Query Response: ", userAuth);  // Log userAuth response

  // Fetch the invite details based on the token
  const invite = useQuery(api.group_invites.validateInvite, { invite_token });
  console.log("Invite Query Response: ", invite);  // Log invite details

  // Mutation to add the user to the group
  const addUserToGroup = useMutation(api.groups.addUserToGroup);

  useEffect(() => {
    const handleInvite = async () => {
      console.log("Invite Token:", invite_token);
      console.log("User Auth:", userAuth);
      console.log("Invite Details:", invite);

      if (!userAuth) {
        console.log("User not authenticated, redirecting to login.");
        navigate(`/login?redirect=/invite/${invite_token}`);
        return;
      }

      if (userAuth && invite) {
        try {
          console.log("User authenticated, adding to group.");
          await addUserToGroup({ group_id: invite.group_id });
          // Redirect to the group details page after successfully adding the user
          navigate(`/groups/${invite.group_id}`);
        } catch (err) {
          // Handle errors (e.g., invalid or expired invite)
          setErrorMessage("Invalid or expired invite.");
        }
      }
    };

    if (invite_token) {
      handleInvite();
    }
  }, [userAuth, invite, invite_token, navigate, addUserToGroup]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  // Return a loading screen if invite details or user authentication status are not yet available
  if (!invite || !userAuth) {
    console.log("Loading invite or user details...");
    return <div>Loading invite details...</div>;
  }

  return <div>Processing your invite...</div>;
}

export default InviteHandler;
