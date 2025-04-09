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
    set({ isUsersLoading: true }); // Assuming isUsersLoading was intended
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (err) {
      // Handle error appropriately
    } finally {
      set({ isUsersLoading: false }); // Assuming isUsersLoading was intended
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      const messagesData = Array.isArray(res.data) ? res.data : []; // Ensure array
      set({ messages: messagesData });
    } catch (err) {
      toast.error("unknown error!");
      set({ messages: [] }); // Set empty on error
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (formData) => {
    set({ isSending: true });
    const { selectedUser } = get(); // Get selectedUser from state
    if (!selectedUser) {
        set({ isSending: false });
        return toast.error("No user selected to send message to."); // Handle error
    }
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        formData
      );
      // Add the successfully sent message (returned from API) to state
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
    if (!socket) return; // Added check for socket existence

    const handler = (newMessage) => {
      // VVVV --- DEBUG LOG ADDED --- VVVV
      console.log(`%%% HANDLER FIRED %%% Time: ${new Date().toISOString()}, Message ID: ${newMessage?._id}, Sender: ${newMessage?.senderId}`);

      // Re-fetch selectedUser inside handler to ensure it's current
      const currentSelectedUser = useChatStore.getState().selectedUser;
      if (!currentSelectedUser) return;

      // Logic to only add message if it's from the currently selected user
      const isFromSelectedUser = newMessage.senderId === currentSelectedUser._id;
      // Check if message receiver is the current logged-in user
      const currentUserId = useAuthStore.getState().user?._id;
      const isToCurrentUser = newMessage.receiverId === currentUserId;

      // Only update state if the message is directly from the selected user to the current user
      if (isFromSelectedUser && isToCurrentUser) {
         set((state) => ({ messages: [...state.messages, newMessage] }));
      } else {
        // Optionally handle messages for non-selected chats (e.g., unread count)
      }
    };

    // Remove previous listener before adding new one (safer approach)
    socket.off("newMsg", handler); // Try removing specifically if handler reference is stable (it's not here)
    socket.off("newMsg"); // Fallback: remove all listeners for 'newMsg'
    socket.on("newMsg", handler);

  },

  unlistenToMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    // Attempt to remove all listeners for 'newMsg' during cleanup
    socket.off("newMsg");
  },

  handleDeleteMessage: async (messageId) => {
    try {
      // Optimistic UI
      set(state => ({ messages: state.messages.filter(msg => msg._id !== messageId) }));
      await axiosInstance.delete(`/message/delete-message/${messageId}`);
    } catch (err) {
      toast.error("Failed to delete message");
      // Consider adding message back or re-fetching on error
    }
  },
}));