'use client';
import { clsx } from 'clsx';

const notifications = [
  {
    id: 1,
    title: 'Content Approved',
    message: 'Your content "Physics 101" has been approved by the principal.',
    time: '2 mins ago',
    isNew: true,
  },
  {
    id: 2,
    title: 'New Broadcast Scheduled',
    message: '"Annual Sports Day" announcement is scheduled for tomorrow.',
    time: '1 hour ago',
    isNew: true,
  },
  {
    id: 3,
    title: 'System Update',
    message: 'The broadcasting system will be under maintenance at midnight.',
    time: '5 hours ago',
    isNew: true,
  },
];

export const NotificationDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <h4 className="font-bold">Notifications</h4>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">3 NEW</span>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-border last:border-0 transition-colors group"
          >
            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{n.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
            <p className="text-[10px] text-primary mt-1 font-medium italic">{n.time}</p>
          </div>
        ))}
      </div>
      <button className="w-full py-2 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border mt-1">
        View All Notifications
      </button>
    </div>
  );
};
