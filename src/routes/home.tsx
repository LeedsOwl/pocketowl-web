import { Button } from "@/components/ui/button";
import Balance from '@/components/ui/balance';
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };
  
  return (
    <div>
      <Balance accountBalance={1000} income={500} expenses={200} currency="£" />
      <h1>Home</h1>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}

export default Home;
