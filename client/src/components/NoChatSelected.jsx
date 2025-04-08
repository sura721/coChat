import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="hidden sm:flex flex-col items-center justify-center h-full bg-[#0E1621] text-gray-400">
      <div className="w-24 h-24 rounded-full bg-[#242f3d] flex items-center justify-center mb-4">
        <MessageSquare size={40} />
      </div>
      <h4 className="text-xl font-medium mb-2">Welcome to coChat!</h4>
      <p className="text-sm">Select a conversation from the sidebar to start chatting</p>
    </div>
  );
};

export default NoChatSelected;