import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

function Home() {
  const { signOut } = useAuthActions();

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}

export default Home;
