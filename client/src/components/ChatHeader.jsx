import React from "react";
import { useChatStore } from "../store/useChat.Store";
import { ChevronLeft, MoreVertical, Phone, Search,Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ChatHeader = () => {
  const { selectedUser, setSelectedUser,isRemoteUserTyping } = useChatStore();
const navigate = useNavigate()
  return (
    <header className="bg-[#17212b] border-b border-[#242f3d] p-3 flex items-center gap-3">
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 hover:bg-[#242f3d] rounded-full transition-colors"      >
        <ChevronLeft size={24} className="text-gray-400" />
      </button>
      
      <div className="flex items-center gap-3 flex-1">
        <img
            onClick={()=>navigate('/friend-profile')}
          src={selectedUser?.profilePic || "/avatar.png"}
          alt="profile pic"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#2AABEE]/20"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-100">
            {selectedUser?.fullname || "Select a user"}
          </h3>
          <div className="text-sm text-gray-400">
          <div className="h-5 mb-1 text-xs text-blue-300 italic transition-opacity duration-300 ease-in-out"
            
        >
          {selectedUser?.username || "to start messaging"}
      </div>                                                                                    
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-[#242f3d] rounded-full transition-colors">
          <Phone size={20} className="text-gray-400" />
        </button>
        <button className="p-2 hover:bg-[#242f3d] rounded-full transition-colors">
          <Search size={20} className="text-gray-400" />
        </button>
        <button className="p-2 hover:bg-[#242f3d] rounded-full transition-colors">
          <MoreVertical size={20} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;