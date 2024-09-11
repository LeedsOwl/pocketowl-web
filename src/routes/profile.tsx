import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const [darkMode, setDarkMode] = useState(false); 

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  const userInfo = useQuery(api.users.getUserInfo, {});

  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
  };

  return (
    <div>
      <div className="p-1 overflow-y-auto max-h-screen">
        <div
          className="text-white p-14 bg-background rounded-lg shadow-md"
          style={{
            backgroundImage: "url('/stacked-waves.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="items-center text-center">
            <p className="text-2xl font-semibold">{userInfo?.name}</p>
            <p className="text-lg font-bold text-gray-400">
            {userInfo?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pt-5">
        <div className="w-full max-w-4xl p-6 rounded-xl bg-gray-600 shadow-lg">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-xl font-semibold">Account settings</h1>
            <div className="space-y-4">
              <label>
                Change Email
                <Input type="email" placeholder="Enter new email" />
              </label>
              <label>
                Change Phone Number
                <Input type="tel" placeholder="Enter new phone number" />
              </label>
              <label>
                Change Password
                <Input type="password" placeholder="Enter new password" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Switch id="dark-mode-toggle" checked={darkMode} onChange={handleThemeToggle} />
            <Label htmlFor="dark-mode-toggle">{darkMode ? "Dark Mode" : "Light Mode"}</Label>
          </div>
          <div className="mt-6 flex justify-center">
            <Button className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
