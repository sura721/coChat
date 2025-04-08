import React, { useEffect } from "react";

import { useAuthStore } from "./store/useAuth.store";
import Navbar from "./components/navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/profilepage";
import SearchUsers from "./pages/SearchUsers";
import { Loader } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import FriendProfile from "./pages/friendProfile";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();

  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#17212b]">
        <Loader className="size-10 animate-spin text-[#71808a]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#17212b] text-gray-100">
      {!authUser && <Navbar />}
      <main className={`${authUser ? 'pt-0' : 'pt-16'} min-h-screen`}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to={"/"} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friend-profile" element={<FriendProfile />} />
          <Route path="/search-users" element={<SearchUsers />} />
        </Routes>
      </main>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'bg-[#242f3d] text-gray-100',
          duration: 3000,
          style: {
            background: '#242f3d',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default App;
