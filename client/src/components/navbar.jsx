import React, { useState } from 'react'
import { LogOut, MessageSquare, User, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../store/useAuth.store';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold hidden sm:block">coChat</h1>
            </Link>
          </div>

         
          {authUser && (
            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="size-6" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <Link to={"/Notifications"} className="btn btn-sm gap-2">
                  <Bell className="size-5" />
                  <span>Notifications</span>
                </Link>
                <button className="btn btn-sm gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {isMobileMenuOpen && authUser && (
            <div className="absolute top-16 left-0 right-0 bg-base-100 border-b border-base-300 sm:hidden">
              <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
                <Link 
                  to={"/profile"} 
                  className="btn btn-sm gap-2 justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to={"/Notifications"} 
                  className="btn btn-sm gap-2 justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bell className="size-5" />
                  <span>Notifications</span>
                </Link>
                <button 
                  className="btn btn-sm gap-2 justify-start" 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;