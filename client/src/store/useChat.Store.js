import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import {io} from "socket.io-client"
import { useAuthStore } from "./useAuth.store";
export const useChatStore = create((set,get)=>({
  messages:[],
  users:[],
  selectedUser:null,
  isMessagesLoading :false,
  isUsersLoading:false,
  isSending:false,
  getUsers:async()=>{
    set({isMessagesLoading:true})
    try {
      const res = await axiosInstance.get("/message/users")
      set({users:res.data})
    } catch (err) {
      // toast.error("Error on getting friends ")
    }finally{
      set({isMessagesLoading:false})
    }
  },
  getMessages:async(userId)=>{
    set({isMessagesLoading:true})

   try {
    const res = axiosInstance.get(`/message/${userId}`)
    set({messages:(await res).data})
   } catch (err) {
    toast.error("unknown error!")
   }finally{
    set({isMessagesLoading:false})
   }
  },
  setSelectedUser:(selectedUser)=>{set({selectedUser})},
  sendMessage: async (formData) => {
    set({isSending:true})
    try {
      const { messages, selectedUser } = get();
  
  
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, formData);
  

      set({messages:[...messages,res.data]})

    } catch (err) {
      toast.error(err.response.data.message);
    }finally{
      set({isSending:false})
    }
  },
 
  listenToMessage:()=>{
    const {selectedUser} =get();
    const socket=useAuthStore.getState().socket;

if(!selectedUser) return;
socket.on('newMsg',(newMessage)=>{
  const msgFromselectedUser=newMessage.senderId !== selectedUser._id;
  if(msgFromselectedUser) return;
  set({messages:[...get().messages,newMessage]})
})
  }
  ,
  unlistenToMessage:()=>{
    const socket = useAuthStore.getState().socket
    socket.off('newMsg')

  },
  handleDeleteMessage:async(messageId)=>{
try {
  const res = await axiosInstance.delete(`/message/delete-message/${messageId}`)
 set({messages:res.data})
} catch (err) {

}

  }
}))

