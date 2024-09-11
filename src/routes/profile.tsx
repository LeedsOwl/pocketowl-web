import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input  } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { CurrencyPreferenceSwitch } from "@/components/ui/currency-preference-switch";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
import { FaEnvelope, FaPhone, FaKey, FaBell, FaSms, FaPowerOff, FaMoneyBillAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userHasPreference, setUserHasPreference] = useState<boolean>(false);
  const { setTheme } = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (!userHasPreference) {
      setDarkMode(mediaQuery.matches);
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!userHasPreference) {
        const newTheme = e.matches ? 'dark' : 'light';
        setDarkMode(e.matches);
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [setTheme, userHasPreference]);

  const handleThemeToggle = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    setTheme(newTheme);
    setUserHasPreference(true);
  };

  const handleMailToggle = () => {
    setIsEnabled(!isEnabled);
  };

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  };

  const userInfo = useQuery(api.users.getUserInfo, {});

  const [currency, setCurrency] = useState<string>('GBP');

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: { opacity: 0, y: 30, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
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
            <p className="text-lg font-bold text-gray-400">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <motion.div className="p-3">
        <motion.div
          className="flex flex-col items-center pt-2 px-2 border rounded-lg shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="w-full max-w-4xl p-6 dark:bg-background rounded-xl shadow-lg space-y-4">
            <motion.div className="border-b pb-4 mb-4">
              <motion.h1 className="text-xl font-semibold" variants={itemVariants}>Account Settings</motion.h1>
              <div className="space-y-4">
                <motion.label className="flex items-center space-x-2" variants={itemVariants}>
                  <FaEnvelope className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Change Email</span>
                  <Input type="email" placeholder="Enter new email" />
                </motion.label>
                <motion.label className="flex items-center space-x-2" variants={itemVariants}>
                  <FaPhone className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Change Phone Number</span>
                  <Input type="tel" placeholder="Enter new phone number" />
                </motion.label>
                <motion.label className="flex items-center space-x-2" variants={itemVariants}>
                  <FaKey className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <span className="mb-2">Change Password</span>
                  <Input type="password" placeholder="Enter new password" />
                </motion.label>
                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  {/* <FaMoneyBillAlt className="w-7 h-7 p-1 bg-secondary rounded-full border border-white" />
                  <Select value={currency} onChange={handleCurrencyChange}>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </Select> */}
                  {/* <CurrencyPreferenceSwitch /> */}
                </motion.div>
              </div>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div className="border-b pb-4 mb-4" variants={itemVariants}>
              <motion.h1 className="text-xl font-semibold">Appearance</motion.h1>
              <motion.div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch
                  id="dark-mode-toggle"
                  checked={darkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </motion.div>
            </motion.div>

            {/* Notifications Settings */}
            <motion.div className="border-b pb-4 mb-4" variants={itemVariants}>
              <motion.h1 className="text-xl font-semibold">Notifications</motion.h1>
              <div className="space-y-4">
                <motion.label className="flex items-center justify-between space-x-2" variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <FaBell />
                    <span>Email Notifications</span>
                  </div>
                  <Switch />
                </motion.label>
                <motion.label className="flex items-center justify-between space-x-2" variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <FaSms />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch />
                </motion.label>
                <motion.label className="flex items-center justify-between space-x-2" variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <FaBell />
                    <span>Push Notifications</span>
                  </div>
                  <Switch />
                </motion.label>
              </div>
            </motion.div>

            {/* Sign Out Button */}
            <motion.div className="mt-6 flex justify-center pb-24" variants={itemVariants}>
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
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Profile
