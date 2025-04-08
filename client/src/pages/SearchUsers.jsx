import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, MessageSquare, ArrowLeft } from "lucide-react";
import { axiosInstance } from "../lib/axios.lib.js";
import { useAuthStore } from "../store/useAuth.store.js";
import { useFriendship } from "../store/useFriendship.store.js";
import { Navigate } from "react-router-dom";
const SearchUsers = () => {
const [searchQuery,setSearchQuery] = useState("")
  const navigate = useNavigate();
const {findUsers,searchResult,loading,handleMessageClick} = useFriendship()
const {authUser} =useAuthStore()

  useEffect(() => {
    if (searchQuery.length > 0) {
      const debounceTimeout = setTimeout(() => {
        findUsers(searchQuery,authUser._id);
      }, 500); 

      return () => clearTimeout(debounceTimeout); 
    } 
  }, [searchQuery]);



  const handleAddFriend = (receiverId, senderId) => {
    
    handleMessageClick(receiverId, senderId, navigate);
  };

  return (
    <div className="min-h-screen bg-[#17212b] text-white">
     
      <div className="sticky top-0 z-10 bg-[#17212b] border-b border-[#242f3d] p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-[#242f3d] rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold">Search Users</h1>
        </div>
      </div>

      
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-[#242f3d] text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

   
      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {loading && searchQuery && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AABEE] mx-auto"></div>
              <p className="mt-4 text-gray-400">Searching users...</p>
            </div>
          )}

       
          {searchQuery ? (
            <div className="space-y-4">
              {searchResult.map((user) => (
                <div key={user._id} className="bg-[#242f3d] rounded-lg p-4 flex items-center justify-between hover:bg-[#2AABEE]/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#2AABEE]/20 flex items-center justify-center">
                        <User size={24} className="text-[#2AABEE]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{user.username}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user._id,authUser._id)}
                    className="flex items-center gap-2 bg-[#2AABEE] text-white px-4 py-2 rounded-lg hover:bg-[#2AABEE]/90 transition-colors"
                  >
                    <MessageSquare size={18} />
                    Message
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Start typing to search users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
