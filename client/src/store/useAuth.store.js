import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BACKEND_URL="https://cochat-4vrg.onrender.com"

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isVerified:false,
  isSigningUping: false,
  isLoggingIn: false,
  isCodeValid:null,
  showCodeConfirmation:false,
  isCheckingAuth: true,
  isUpdatingProfile:false,
  socket:null, 
   onlineUsers:[]
,
setIsVerified:(data)=>set({isVerified:data}),
checkAuth: async () => {
  set({ isCheckingAuth: true });
  try {
    const res = await axiosInstance.get("/auth/me", {
      withCredentials: true, 
    });

    set({ authUser: res.data });


    if (typeof get().connectSocket === 'function') {
      get().connectSocket(); 
    }
  } catch (err) {
   
    set({ authUser: null }); 
  } finally {
    set({ isCheckingAuth: false });
  }
},






  
signUP: async (formData) => {
  set({ isSigningUping: true });
  try {
    const res = await axiosInstance.post("/auth/signup", formData);


    toast.success("Account Created Successfully!");
    get().connectSocket(); 
     set({isVerified:true})
  } catch (err) {

   

  } finally {
    set({ isSigningUping: false });
  }
},
verifyOTP: async (data, navigate) => {
  set({ isSigningUping: true });
  try {
    const res = await axiosInstance.post("/auth/verify", data);
    set({ authUser: res.data });
    set({isCodeValid:true})
    get().connectSocket();
    navigate('/'); 
  } catch (err) {
    toast.error(err.response.data.message);
 
    set({isCodeValid:false})
  } finally {
    set({ isSigningUping: false });
  }
},

resendOTP : async (email) => {
  try {
    const response = await axiosInstance.post('/auth/resend-otp', email );
   
    set({isCodeValid:null}) 
    toast.success("we sent a code  to our email.  verify it!")
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to resend OTP');
    set({isCodeValid:null})
  }
},
  logout:async()=>{
   try {
    const res = await axiosInstance.post("/auth/logout",{},{withCredentials:true})
    set({authUser:null})
    toast.success("logout Successfully!")
    get().disconnectSocket()
   } catch (err) {

   }
  },
  login :async(formData)=>{
    set({isLoggingIn:true});
    try {
      const res = await axiosInstance.post("/auth/login",formData)
      set({authUser:res.data})
      toast.success("logged in Successfully")
      get().connectSocket()
      console.log(res.data)


    } catch (err) {
      console.log(err)
      set({isLoggingIn:false})
      toast.error(err.response.data.message)
      
    }finally{set({isLoggingIn:false})}
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    
    if (!authUser || socket?.connected) return;
    
    const newSocket = io(BACKEND_URL, { query: { userId: authUser._id } });
  
    set({ socket: newSocket });
    newSocket.on('getOnlineUsers', (usersId) => {
      set({ onlineUsers: usersId });
    });
  },
  
  disconnectSocket: () => {
    const socket = get().socket;  
    if (socket && socket.connected) {  
      socket.disconnect();  
    }
  },
  setAuthUser:(data)=>{
    set({authUser:data})
  },
  deleteAccount: async (data,navigate) => {
    try {
      const response = await axiosInstance.post("/auth/delete-account", data); 
      if (response.status === 200) {
        set({ showCodeConfirmation: false });
        toast.success("Account deleted successfully!");
        set({authUser:null})
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error("Invalid code. Please try again.");
    }
  },
  
  setShowCodeConfirmation:(data)=>{set({showCodeConfirmation:data})}
}));

