import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChat.Store';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { formatChatTime } from '../lib/utils';
import { useAuthStore } from '../store/useAuth.store';
import { Trash } from 'lucide-react';

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isMessagesLoading,
    listenToMessage,
    unlistenToMessage,
    handleDeleteMessage
  } = useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      listenToMessage();
    }
    return () => {
      unlistenToMessage();
    };
  }, [selectedUser?._id, getMessages, listenToMessage, unlistenToMessage]);

  const messageEnd = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messageEnd.current && messages?.length > 0) {
        messageEnd.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  if (isMessagesLoading || !authUser || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#0E1621]">
        <ChatHeader />
        <div className="flex-1 overflow-hidden p-4 space-y-2">
          {[...Array(5)].map((_, i) => <MessageSkeleton key={i} />)}
        </div>
        {selectedUser && <MessageInput />}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0E1621]">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => {
          const isAuthUserSender = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex ${isAuthUserSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[75%] items-end gap-2 ${
                  isAuthUserSender ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!isAuthUserSender && selectedUser?.profilePic && (
                  <div className="size-8 rounded-full flex-shrink-0 self-end">
                    <img
                      src={selectedUser.profilePic || '/avatar.png'}
                      alt="profile pic"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
                 {!isAuthUserSender && !selectedUser?.profilePic && (
                     <div className="size-8 flex-shrink-0"></div>
                 )}

                <div className={`flex flex-col ${isAuthUserSender ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-3 relative shadow-md ${
                      isAuthUserSender
                        ? 'bg-[#2AABEE] text-white rounded-br-none'
                        : 'bg-[#242f3d] text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image?  message.image: '/avatar.png'}
                        alt="Attachment"
                        className="max-w-[250px] sm:max-w-[300px] h-auto rounded-lg mb-2 object-cover block"
                      />
                    )}
                    {message.text && (
                      <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                   <div className={`flex items-center mt-1 px-1 ${isAuthUserSender ? 'flex-row-reverse gap-2' : 'gap-1'}`}>
                     <time className="text-xs text-gray-500">
                       {formatChatTime(message.createdAt)}
                     </time>
                     {isAuthUserSender && (
                       <button
                         onClick={() => handleDeleteMessage(message._id)}
                         className="text-gray-400 hover:text-red-500 active:text-red-700 transition-colors duration-150"
                         aria-label="Delete message"
                       >
                         <Trash size={14} />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEnd} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;