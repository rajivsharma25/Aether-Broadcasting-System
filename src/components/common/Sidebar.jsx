'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  CheckCircle, 
  List,
  Monitor,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = user?.role === 'teacher' 
    ? [
        { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
        { name: 'Upload Content', href: '/teacher/upload', icon: Upload },
        { name: 'My Content', href: '/teacher/content', icon: FileText },
      ]
    : [
        { name: 'Dashboard', href: '/principal', icon: LayoutDashboard },
        { name: 'Approvals', href: '/principal/approvals', icon: CheckCircle },
        { name: 'All Content', href: '/principal/all-content', icon: List },
      ];

  return (
    <aside className={clsx(
      "fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-64 border-r border-t border-border bg-card p-4 transition-transform duration-300 flex flex-col",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Mobile User Info Section */}
      <div className="md:hidden mb-6 px-2 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={clsx(
                'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all duration-300'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <Link
          href={`/live/${user?.id}`}
          target="_blank"
          onClick={onClose}
          className="flex items-center space-x-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
        >
          <Monitor className="h-5 w-5" />
          <span>View Public Page</span>
        </Link>

        {/* Mobile Logout - Hidden on Desktop */}
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="md:hidden flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
