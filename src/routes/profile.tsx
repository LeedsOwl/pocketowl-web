import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  const userInfo = useQuery(api.users.getUserInfo, {});

  return (
    <div>
      <h1>{userInfo?.name}</h1>
      <Button className="bg-destructive text-destructive-foreground" onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}

export default Profile;
