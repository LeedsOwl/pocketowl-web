import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

function Welcome() {
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);
  const [incomeType, setIncomeType] = useState<string>("gross");

  const saveUserFinancialData = useMutation(api.finance.setUserFinancialData);

  const handleSubmit = async () => {
    if (accountBalance !== null && income !== null) {
      try {
        await saveUserFinancialData({
          account_balance: accountBalance,
          income: income,
          income_type: incomeType,
        });
        alert("Financial data saved successfully!");
      } catch (err) {
        console.error("Error saving financial data:", err);
      }
    }
  };

  const formVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, duration: 0.8 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <motion.section
      className="relative grid place-items-center min-h-screen bg-background text-background"
      style={{
        backgroundImage: "url('/register.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeIn} // Section fade-in
    >
      <motion.div
        className="container mx-auto flex justify-center items-center flex-col"
        variants={formVariant} // Form entrance animation
      >
        {/* Centered Welcome Image */}
        <motion.img
          className="rounded-full mb-8 bg-background"
          src="/logo.png"
          alt="Welcome"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } }}
        />

        {/* Form Container */}
        <div className="welcomeForm justify-center">
          <div className="justify-center">
            <motion.h2
              className="mb-8 text-3xl font-bold text-background"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            >
              Welcome! Enter Your Financial Data
            </motion.h2>

            <div>
              <motion.form
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={formVariant} // Form animation variant
              >
                {/* Account Balance Input */}
                <div className="relative">
                  <motion.input
                    type="number"
                    className="peer block w-full rounded border border-background bg-transparent py-2 px-3 leading-tight outline-none transition-all duration-200 ease-linear focus:border-white focus:text-white dark:text-neutral-200 placeholder-transparent"
                    value={accountBalance ?? ""}
                    onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                    placeholder="Enter your account balance"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  />
                  <motion.label
                    className={`pointer-events-none text-background absolute bottom-3 left-4 mb-0 origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out 
                    ${accountBalance ? "-translate-y-[1.6rem] scale-[0.8]" : ""} 
                    peer-placeholder-shown:translate-y-[0.4rem] peer-placeholder-shown:scale-[1] peer-focus:-translate-y-[1.6rem] peer-focus:scale-[0.8] peer-focus:text-white`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  >
                    Account Balance
                  </motion.label>
                </div>

                {/* Income Input */}
                <div className="relative">
                  <motion.input
                    type="number"
                    className="peer block w-full rounded border border-background bg-transparent py-2 px-3 leading-tight outline-none transition-all duration-200 ease-linear focus:border-white focus:text-white dark:text-neutral-200 placeholder-transparent"
                    value={income ?? ""}
                    onChange={(e) => setIncome(parseFloat(e.target.value))}
                    placeholder="Enter your income"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  />
                  <motion.label
                    className={`pointer-events-none text-background absolute bottom-3 left-4 mb-0 origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out 
                    ${income ? "-translate-y-[1.6rem] scale-[0.8]" : ""} 
                    peer-placeholder-shown:translate-y-[0.4rem] peer-placeholder-shown:scale-[1] peer-focus:-translate-y-[1.6rem] peer-focus:scale-[0.8] peer-focus:text-white`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.8 } }}
                  >
                    Income
                  </motion.label>
                </div>

                {/* Income Type Select */}
                <div className="relative">
                  <motion.select
                    className="peer block w-full rounded border border-background bg-transparent py-2 px-3 leading-tight outline-none transition-all duration-200 ease-linear focus:border-white focus:text-black dark:text-black"
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1 } }}
                  >
                    <option value="gross">Gross Income</option>
                    <option value="after_tax">After Tax Income</option>
                    <option value="disposable">Disposable Income</option>
                  </motion.select>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  className="w-full rounded bg-background text-[#3f7ea6] dark:text-white px-6 py-3 text-xs font-medium uppercase leading-normal shadow-md transition duration-150 ease-in-out hover:bg-white hover:text-background focus:bg-white focus:text-background focus:outline-none focus:ring-2 focus:ring-white active:bg-background active:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Data
                </motion.button>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Welcome;
