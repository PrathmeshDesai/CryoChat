import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from 'react-router-dom';

function Navbar() {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold">CryoChat</h1>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="btn btn-sm btn-ghost gap-2 text-base-content hover:bg-base-200 px-3"
            >
              <Settings className="w-5 h-5 text-base-content" />
              <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm btn-ghost gap-2 text-base-content hover:bg-base-200 px-3"
                >
                  <User className="w-6 h-6 text-base-content" />
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-sm btn-ghost gap-2 text-base-content hover:bg-base-200 px-3"
                >
                  <LogOut className="w-6 h-6 text-base-content" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;