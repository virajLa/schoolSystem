import React, { useState } from 'react';
import { User } from '../types';
import { Bell, RefreshCw, GraduationCap, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onReset: () => void;
  notifications: string[];
  clearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onReset,
  notifications,
  clearNotifications,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-100 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" id="logo-icon" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-gray-900 tracking-tight text-lg">SchoolFlow</h1>
              <p className="text-xs text-gray-500 font-medium">Academic Operations Node</p>
            </div>
          </div>

          {/* Secure Environment Flag Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-150 px-3 py-1 rounded-full text-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-emerald-900 font-bold text-3xs uppercase tracking-wider">Secure Database Connected</span>
          </div>

          {/* Right Side Options */}
          <div className="flex items-center gap-4">
            {/* Notifications Menu */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-150/50 rounded-lg transition-all"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  id="notifications-panel" 
                  className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700">Active System Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        id="btn-clear-notifications"
                        onClick={clearNotifications}
                        className="text-2xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No active pending alerts.
                      </div>
                    ) : (
                      notifications.map((note, index) => (
                        <div key={index} className="p-3 text-xs text-gray-600 bg-emerald-50/20 hover:bg-gray-50 flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          <p className="leading-relaxed">{note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Reset State Trigger */}
            <button
              id="btn-global-reset"
              onClick={onReset}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              title="Synchronize & Refresh Global Database Ledger"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* User Avatar Menu Dropdown Selector */}
            <div className="relative">
              <button
                id="btn-avatar-menu"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 text-left hover:opacity-90 select-none cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.name}
                  className="h-9 w-9 rounded-full object-cover border border-emerald-500/30 bg-emerald-50"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{currentUser.name}</div>
                  <div className="text-2xs text-emerald-600 font-bold tracking-wide">{currentUser.role}</div>
                </div>
              </button>

              {showProfileMenu && (
                <div 
                  id="user-profile-dropdown" 
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in"
                >
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">{currentUser.name}</p>
                    <p className="text-2xs text-gray-500 truncate">{currentUser.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-3xs uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                        {currentUser.role}
                      </span>
                      <span className="text-3xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
                        {currentUser.department}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action items */}
                  <div className="p-1">
                    <button
                      id="btn-logout-dropdown"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left font-semibold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Log Out of Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
