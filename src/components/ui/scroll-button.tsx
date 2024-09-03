import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ScrollButtonProps = {
  onClick: () => void;
};

const ScrollButton = ({ onClick }: ScrollButtonProps) => {
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
      className="p-3 rounded-full shadow-lg border border-gray-300 bg-[#7eafce21] hover:bg-blue-800 backdrop-blur-3xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      onClick={onClick}
    >
      <div className="flex items-center">
        <PlusIcon className="h-6 w-6 text-white" />
        <span
          className={`text-white font-semibold overflow-hidden transition-all duration-300 ease-in-out ${
            showText
              ? "max-w-full opacity-100 pl-4 border-l border-gray-300 ml-3"
              : "transition-[max-width,opacity,padding] duration-500 max-w-0 opacity-0 pl-0 border-l-0 ml-0"
          }`}
        >
          Add Expense
        </span>
      </div>
    </Button>
  );
};

export default ScrollButton;
