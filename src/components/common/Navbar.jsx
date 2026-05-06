'use client';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, User as UserIcon, Bell, Menu, Radio } from 'lucide-react';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side: Hamburger & Logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-foreground hidden sm:block leading-none uppercase">Aether</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] hidden sm:block mt-1 leading-none uppercase">Broadcast System</span>
            </div>
          </div>
        </div>

        {/* Right Side: Notifications & Avatar */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={clsx(
                "relative rounded-full p-2 transition-all duration-300 group cursor-pointer",
                isNotificationsOpen ? "bg-primary/10" : "hover:bg-primary/10"
              )}
            >
              <Bell className={clsx(
                "h-5 w-5 transition-colors",
                isNotificationsOpen ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-sm" />
            </button>

            <NotificationDropdown 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>
          
          <div className="flex items-center space-x-3 border-l border-border pl-2 md:pl-4">
            {/* User Name/Role - Hidden on Mobile */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
            
            {/* Avatar - Always Visible */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <UserIcon className="h-5 w-5" />
            </div>

            {/* Logout Button - Hidden on Mobile (moved to sidebar) */}
            <div className="hidden md:block">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="ml-2 group hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600" />
                <span className="group-hover:text-red-600">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
