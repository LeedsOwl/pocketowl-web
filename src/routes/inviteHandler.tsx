import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

function InviteHandler() {
  const { invite_token } = useParams<{ invite_token: string }>();
  const navigate = useNavigate();
  const { signIn } = useAuthActions();

  const [errorMessage, setErrorMessage] = useState("");

  // Check if the user is authenticated
  const userAuth = useQuery(api.auth.getUser);

  // Fetch the invite details based on the token
  const invite = useQuery(api.group_invites.validateInvite, { invite_token });

  // Mutation to add user to group
  const addUserToGroup = useMutation(api.groups.addUserToGroup);

  useEffect(() => {
    const handleInvite = async () => {
      console.log("Invite Token:", invite_token);
      console.log("User Auth Query Response:", userAuth);
      console.log("Invite Query Response:", invite);

      // Check if data is still loading
      if (userAuth === undefined || invite === undefined) {
        console.log("Loading invite or user details...");
        return;
      }

      // If user is not authenticated, redirect to login
      if (!userAuth) {
        console.log("User not authenticated, redirecting to login.");
        navigate(`/login?redirect=/invite/${invite_token}`);
        return;
      }

      // If user is authenticated and invite is valid, add the user to the group
      if (userAuth && invite) {
        try {
          console.log("User is authenticated, processing invite.");
          await addUserToGroup({ group_id: invite.group_id });
          navigate(`/groups/${invite.group_id}`);
        } catch (err) {
          setErrorMessage("Invalid or expired invite.");
        }
      }
    };

    handleInvite();
  }, [userAuth, invite, invite_token, navigate, addUserToGroup]);

  if (userAuth === undefined || invite === undefined) {
    return <div>Loading invite or user details...</div>; // Return loading state while queries are loading
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return <div>Processing your invite...</div>;
}

export default InviteHandler;
