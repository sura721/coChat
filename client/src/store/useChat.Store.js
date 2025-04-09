import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuth.store";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessagesLoading: false,
  isUsersLoading: false,
  isSending: false,
  getUsers: async () => {
    set({ isUsersLoading: true });  
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (err) {
   
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      const messagesData = Array.isArray(res.data) ? res.data : []; 
      set({ messages: messagesData });
    } catch (err) {
      toast.error("unknown error!");
      set({ messages: [] }); 
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (formData) => {
    set({ isSending: true });
    const { selectedUser } = get(); 
    if (!selectedUser) {
        set({ isSending: false });
        return toast.error("No user selected to send message to."); 
    }
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        formData
      );
     
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSending: false });
    }
  },

  listenToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return; 

    const handler = (newMessage) => {

     
      const currentSelectedUser = useChatStore.getState().selectedUser;
      if (!currentSelectedUser) return;

      const isFromSelectedUser = newMessage.senderId === currentSelectedUser._id;
      
      const currentUserId = useAuthStore.getState().user?._id;
      const isToCurrentUser = newMessage.receiverId === currentUserId;

      if (isFromSelectedUser && isToCurrentUser) {
         set((state) => ({ messages: [...state.messages, newMessage] }));
      } else {
      }
    };

   
    socket.off("newMsg", handler); 
    socket.off("newMsg"); 
    socket.on("newMsg", handler);

  },

  unlistenToMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMsg");
  },

  handleDeleteMessage: async (messageId) => {
    try {
  
      set(state => ({ messages: state.messages.filter(msg => msg._id !== messageId) }));
      await axiosInstance.delete(`/message/delete-message/${messageId}`);
    } catch (err) {
      toast.error("Failed to delete message");
    
    }
  },
}));