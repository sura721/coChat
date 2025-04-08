import React from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChat.Store";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-screen bg-[#17212b]">
      <div className="w-full block sm:hidden">
        {selectedUser ? <ChatContainer /> : <Sidebar />}
      </div>

      <div className="hidden sm:flex w-full">
        <div className="h-full flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 h-full">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;