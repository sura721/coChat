import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChat.Store";
import { useAuthStore } from "../store/useAuth.store";
import { Users, Search, UserPlus, LogOut } from "lucide-react";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (users.length > 0) {
      setAllUsers(users);
    }
  }, [users]);

  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      user.fullname.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);
    const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
    return matchesSearch && matchesOnline;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className={`flex flex-col h-full bg-[#17212b] transition-all duration-300 ${selectedUser ? 'w-20' : 'w-full sm:w-[380px]'}`}>
   
      <div className={`p-4 border-b border-[#242f3d] ${selectedUser ? 'items-center' : ''}`}>
        {!selectedUser && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80">
                <div className="relative">
                  <img
                    src={authUser?.profilePic || "/avatar.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#2AABEE]/20"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#17212b]"></span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-100">
                    {authUser?.fullName || "Me"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {onlineUsers.length - 1} online
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/search-users")}
                  className="p-2 hover:bg-[#242f3d] rounded-full transition-colors"
                >
                  <UserPlus size={20} className="text-gray-400" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-[#242f3d] rounded-full transition-colors"
                >
                  <LogOut size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <label className="cursor-pointer flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-[#242f3d] text-gray-100 placeholder-gray-500 rounded-lg py-2 pl-10 pr-4 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </>
        )}
        {/* Profile Icon for collapsed sidebar */}
        {selectedUser && (
          <Link 
            to="/profile" 
            className="flex justify-center hover:opacity-80"
            title="View Profile"
          >
            <div className="relative">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2AABEE]/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#17212b]"></span>
            </div>
          </Link>
        )}
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => {
          const unreadCount = unreadMessages?.[user._id] || 0;
          
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex ${selectedUser ? 'justify-center' : 'items-center gap-3'} p-4 hover:bg-[#242f3d] transition-colors ${
                selectedUser?._id === user._id ? "bg-[#242f3d]" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullname}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2AABEE]/20"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#17212b]"></span>
                )}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10">
                    {unreadCount}
                  </div>
                )}
              </div>
              {!selectedUser && (
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-100">{user.fullname}</h3>
                  <p className="text-sm text-gray-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </p>
                </div>
              )}
            </button>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {selectedUser ? "" : "No users found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;