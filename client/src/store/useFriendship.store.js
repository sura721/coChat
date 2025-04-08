import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";
import { useChatStore } from "./useChat.Store";

export const useFriendship=create((set,get)=>({
  loading:false,
   
  searchResult:[],
  findUsers: async (searchQuery,searcherId) => {
    
    set({loading:true})
  
    try {
      if(searchQuery.length >0){
        const res = await axiosInstance.get("/users/search-user", { params: { query: searchQuery,searcherId } });
      set({ searchResult: res.data });
      }else{
        set({searchQuery:[]})
      }
    } catch (err) {
  
    } finally {
      set({loading:false})
    }
  },


  handleMessageClick :async (receiverId,senderId,navigate) => {
   
    await axiosInstance.post("/users/add-friend", { receiverId,senderId  })
      .then(res => {
       const  setSelectedUser =useChatStore.getState().setSelectedUser
       setSelectedUser(res.data)
       navigate('/')
       toast.success("Friendship established");
      })
      .catch(err => {
   
      });
  }
  
}))