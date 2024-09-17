import { useQuery, useAction } from "convex/react"; // Use useAction for updateUserPassword
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
import {
  FaEnvelope,
  FaKey,
  FaPowerOff,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const { theme, setTheme } = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const backgroundImage = theme === "dark" ? "/stacked-waves.svg" : "/register.svg";

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handleMailToggle = () => {
    setIsEnabled(!isEnabled);
  };

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  // Query to fetch user info and settings from the backend
  const userInfo = useQuery(api.users.getUserInfo, {});
  const userSettings = useQuery(api.user_settings.getUserSettings, { userId: userInfo?._id });

  const [currency, setCurrency] = useState<string>("GBP");
  const [email, setEmail] = useState<string>(userInfo?.email || "");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [emailStatus, setEmailStatus] = useState({ loading: false, error: "", success: false });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: false });

  useEffect(() => {
    if (userSettings?.currency) {
      setCurrency(userSettings.currency);
    }
    if (userInfo?.email) {
      setEmail(userInfo.email);
    }
  }, [userSettings, userInfo]);

  const updateUserSettings = useAction(api.user_settings.updateUserSettings); // Use useAction for actions
  const updateUserEmail = useAction(api.users.updateUserEmail);
  const updateUserPassword = useAction(api.users.updateUserPassword); // Use useAction

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (userInfo?._id) {
      updateUserSettings({
        userId: userInfo._id,
        currency: newCurrency,
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleEmailSubmit = async () => {
    if (email && userInfo?._id) {
      setEmailStatus({ loading: true, error: "", success: false });
      try {
        await updateUserEmail({
          userId: userInfo._id,
          email: email,
        });
        setEmailStatus({ loading: false, error: "", success: true });
      } catch (err) {
        setEmailStatus({ loading: false, error: "Failed to update email.", success: false });
      }
    }
  };

  const handlePasswordSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordStatus({ loading: false, error: "Please fill in all fields.", success: false });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({ loading: false, error: "New passwords do not match.", success: false });
      return;
    }

    setPasswordStatus({ loading: true, error: "", success: false });
    try {
      await updateUserPassword({
        userId: userInfo._id,
        oldPassword: oldPassword,  // Backend checks old password
        newPassword: newPassword,  // New password to be updated
      });
      setPasswordStatus({ loading: false, error: "", success: true });
    } catch (err) {
      setPasswordStatus({ loading: false, error: "Failed to update password.", success: false });
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: { opacity: 0, y: 30, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
      {/* Profile Header */}
      <div className="p-1 overflow-y-auto max-h-screen">
        <div
          className="text-white p-14 bg-background rounded-lg shadow-md"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="items-center text-center">
            <p className="text-2xl font-semibold">{userInfo?.name || "User"}</p>
            <p className="text-lg font-bold dark:text-gray-400">
              {userInfo?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="p-3">
        <div className="flex flex-col items-center pt-2 px-2 border rounded-lg shadow-md">
          <motion.div
            className="w-full max-w-4xl p-6 dark:bg-background rounded-xl shadow-lg space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Account Settings Section */}
            <motion.div className="border-b pb-4 mb-4">
              <motion.h1 className="text-xl font-semibold">Account Settings</motion.h1>
              <div className="space-y-4">
                {/* Change Email */}
                <motion.label className="flex items-center space-x-2">
                  <FaEnvelope className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Change Email</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter new email"
                  />
                  <Button disabled={emailStatus.loading} onClick={handleEmailSubmit}>
                    {emailStatus.loading ? "Updating..." : "Submit"}
                  </Button>
                </motion.label>
                {emailStatus.success && <p>Email updated successfully!</p>}
                {emailStatus.error && <p className="text-red-500">{emailStatus.error}</p>}

                {/* Change Password */}
                <motion.label className="flex items-center space-x-2">
                  <FaKey className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Old Password</span>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    placeholder="Enter old password"
                  />
                </motion.label>

                <motion.label className="flex items-center space-x-2">
                  <FaKey className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">New Password</span>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="Enter new password"
                  />
                </motion.label>

                <motion.label className="flex items-center space-x-2">
                  <FaKey className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Confirm New Password</span>
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    placeholder="Confirm new password"
                  />
                  <Button disabled={passwordStatus.loading} onClick={handlePasswordSubmit}>
                    {passwordStatus.loading ? "Updating..." : "Submit"}
                  </Button>
                </motion.label>

                {passwordStatus.success && <p>Password updated successfully!</p>}
                {passwordStatus.error && <p className="text-red-500">{passwordStatus.error}</p>}

                {/* Currency Preference */}
                <motion.div className="flex items-center space-x-2">
                  <FaMoneyBillAlt className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Currency Preference</span>
                  <Select onValueChange={handleCurrencyChange} value={currency}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">£ - British Pound</SelectItem>
                      <SelectItem value="CS">Coming Soon</SelectItem>
                      {/* <SelectItem value="USD">$ - US Dollar</SelectItem>
                      <SelectItem value="EUR">€ - Euro</SelectItem> */}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div className="border-b pb-4 mb-4">
              <motion.h1 className="text-xl font-semibold">Appearance</motion.h1>
              <motion.div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch
                  id="dark-mode-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeToggle}
                />
              </motion.div>
            </motion.div>

            {/* Sign Out Button */}
            <motion.div className="mt-6 flex justify-center pb-24">
              <motion.button
                className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded flex items-center space-x-2"
                onClick={handleSignOut}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <FaPowerOff />
                <span>Sign Out</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
