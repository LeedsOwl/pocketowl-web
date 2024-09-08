"use client";

import ScrollButton from "@/components/ui/scroll-button";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AddGroup from "@/components/add-group";

function Groups() {
  const groups = [
    { title: "Roommates", description: "Splitting monthly bills" },
    { title: "Trip to Hawaii", description: "Vacation expenses" },
    { title: "Office Party", description: "Annual office gathering expenses" },
  ];

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-background shadow-md"
        >
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: "url('/stacked-waves.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="items-center text-center">
              <p className="text-2xl font-semibold">Group Split</p>
              <p className="text-lg font-bold text-gray-400">Divide bills seamlessly!</p>
            </div>
          </div>
        </motion.div>
        
        <div>
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-2 text-xl font-bold p-3"
          >
            Invitations
          </motion.h2>
        </div>

        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-2 text-xl font-bold p-3"
        >
          Recent Groups
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
            {groups.map((group, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                 <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800">{group.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">{group.description}</CardDescription>
                  </div>                  <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    View
                  </button>
                </CardHeader>
                
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="fixed bottom-24 right-4 z-100"
        >
          <ScrollButton onClick={""} />
        </motion.div>
        
        <AddGroup />
        <Toaster className="bottom-20" />
      </div>
    </div>
  );
}

export default Groups;
