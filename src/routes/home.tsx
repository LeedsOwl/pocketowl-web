import { Button } from "@/components/ui/button";
import Balance from '@/components/ui/balance';
import { useAuthActions } from "@convex-dev/auth/react";

function Home() {
  const { signOut } = useAuthActions();

  return (
    <div>
      <Balance accountBalance={1000} income={500} expenses={200} />
      <h1>Home</h1>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}

export default Home;
