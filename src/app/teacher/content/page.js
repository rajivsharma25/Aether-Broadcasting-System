'use client';
// My Content: Displays the teacher's uploaded materials with status and scheduling info.
import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import ContentService from '@/services/content.service';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/common/Pagination';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { getScheduleStatus } from '@/utils/helpers';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { clsx } from 'clsx';

export default function MyContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!user?.id) return;
    
    let mounted = true;
    const loadContent = async () => {
      const data = await ContentService.getContent({ teacherId: user.id });
      if (mounted) {
        setContent(data);
        setLoading(false);
      }
    };

    loadContent();
    return () => { mounted = false; };
  }, [user]);

  const totalPages = Math.ceil(content.length / itemsPerPage);
  const currentItems = content.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Content</h1>
          <p className="text-slate-500 font-medium">Manage and track your broadcasting materials.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      ) : content.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <AlertCircle className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No content yet</h3>
          <p className="mt-2 text-slate-500 max-w-sm">You haven&apos;t uploaded any content yet. Start by creating your first broadcast material.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <Card key={item.id} className="group relative flex flex-col overflow-hidden p-0 shadow-lg shadow-slate-200/50">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image 
                    src={item.fileUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  {/* Live Status Overlay */}
                  {item.status === 'approved' && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className={clsx(
                        "inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border ring-1 ring-black/5",
                        getScheduleStatus(item.startTime, item.endTime) === 'Active' 
                          ? "bg-emerald-500/90 text-white border-emerald-400 animate-pulse" 
                          : getScheduleStatus(item.startTime, item.endTime) === 'Scheduled' 
                          ? "bg-blue-500/90 text-white border-blue-400" 
                          : "bg-slate-500/90 text-white border-slate-400"
                      )}>
                        <div className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                        <span>{getScheduleStatus(item.startTime, item.endTime)}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.subject}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold line-clamp-1 text-slate-900">{item.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-slate-500 line-clamp-2 font-medium">{item.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 px-1">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">From</span>
                      <span className="font-bold text-slate-600 text-[11px]">{format(new Date(item.startTime), 'MMM d, h:mm a')}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-100 mx-2" />
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">To</span>
                      <span className="font-bold text-slate-600 text-[11px]">{format(new Date(item.endTime), 'MMM d, h:mm a')}</span>
                    </div>
                  </div>

                  {item.status === 'rejected' && item.rejectionReason && (
                    <div className="mt-4 rounded-xl bg-rose-50 p-3 border border-rose-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Rejection Reason</p>
                      <p className="mt-1 text-xs font-medium text-rose-700 leading-relaxed italic">&quot;{item.rejectionReason}&quot;</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
