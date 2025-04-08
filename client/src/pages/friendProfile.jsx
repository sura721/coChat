import React, { useEffect } from 'react';
import { Mail, NotebookText, AtSign,ArrowLeft } from 'lucide-react';
import { useChatStore } from '../store/useChat.Store';
import { useNavigate } from 'react-router-dom';

const FriendProfile = () => {
  const {selectedUser} = useChatStore();
  const navigate = useNavigate();


  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-300 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-base-content/80">Loading user profile...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-300 flex items-center justify-center p-4 pt-20 pb-10">
      <div className="w-full max-w-lg bg-base-100 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 ease-in-out">
        <div className="p-8 md:p-12 text-center">
          <button onClick={()=>navigate('/')}>         <ArrowLeft className='size-5 text-gray-50 mt-4 ml-4'  />
          </button>
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={`${selectedUser.fullname || 'User'}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-base-100 shadow-lg mx-auto mb-4 transition-transform duration-300 hover:rotate-3"
          />

          <h1 className="text-3xl font-bold text-base-content mb-1">
            {selectedUser.fullname || "User Name"}
          </h1>

          <p className="text-lg text-primary font-medium mb-6 flex items-center justify-center gap-1">
            <AtSign size={18} className="opacity-80" />
            {selectedUser.username || "username"}
          </p>

          <div className="text-left space-y-5 border-t border-base-content/10 pt-6">

            <div className="flex items-start gap-3">
              <Mail size={20} className="text-secondary flex-shrink-0 mt-1 opacity-80" />
              <div>
                <h3 className="text-xs text-base-content/60 uppercase font-semibold tracking-wider">Email</h3>
                <p className="text-base-content break-words">
                  {selectedUser.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <NotebookText size={20} className="text-accent flex-shrink-0 mt-1 opacity-80" />
              <div>
                <h3 className="text-xs text-base-content/60 uppercase font-semibold tracking-wider">Bio</h3>
                <p className="text-base-content whitespace-pre-wrap">
                  {selectedUser.bio || <span className="italic opacity-70">No bio available.</span>}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;