import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GroupButtonProps = {
  onClick: () => void;
};

const GroupButton = ({ onClick }: GroupButtonProps) => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowText(true);
      } else {
        setShowText(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      size="lg"
      // Translucent button - bg-[#7eafce21]
      className="p-3 h-full rounded-full shadow-lg border border-primary bg-[rgba(255,255,255,0.87)] dark:bg-[#1b1f23b2] hover:bg-blue-800 backdrop-blur-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      onClick={onClick}
    >
      <div className="flex items-center">
        <PlusIcon className="h-6 w-6 text-primary" />
        <span
          className="max-w-full text-primary opacity-100 pl-4 border-l border-primary ml-3 duration-500">
          Create Group
        </span>
      </div>
    </Button>
  );
};

export default GroupButton;
