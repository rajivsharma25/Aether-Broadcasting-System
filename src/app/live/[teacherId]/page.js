'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContentService from '@/services/content.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, AlertCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';

export default function PublicLivePage() {
  const { teacherId } = useParams();
  const [activeContent, setActiveContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Polling: Periodically fetch active content for the specific teacher
  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentService.getContent({ 
        teacherId, 
        status: 'approved' 
      });
      
      const now = new Date();
      const currentlyActive = data.filter(item => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        return now >= start && now <= end;
      });

      // Update state only if content list changed to avoid unnecessary re-renders
      setActiveContent(prev => {
        const prevIds = prev.map(c => c.id).join(',');
        const nextIds = currentlyActive.map(c => c.id).join(',');
        if (prevIds === nextIds) return prev;
        
        setCurrentIndex(0);
        return currentlyActive;
      });
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [teacherId]);

  // Auto-Rotation: Cycles through active content based on individual rotation durations
  useEffect(() => {
    if (activeContent.length <= 1) return;

    const currentItem = activeContent[currentIndex];
    if (!currentItem) {
      setCurrentIndex(0);
      return;
    }

    const duration = parseInt(currentItem.rotationDuration || 10) * 1000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeContent.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeContent.length]);
 // Only depend on length change

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-slate-500 font-medium">Connecting to broadcast...</p>
        </div>
      </div>
    );
  }

  const current = activeContent[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 z-10 bg-linear-to-b from-white/90 via-white/40 to-transparent p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Monitor className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Live Broadcast</h1>
              <p className="text-slate-500 text-[10px] md:text-sm font-semibold uppercase tracking-widest">Aether Streaming</p>
            </div>
          </div>
          
          {activeContent.length > 0 && (
            <div className="flex items-center space-x-2 rounded-full bg-red-600 px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold text-white shadow-lg shadow-red-600/20 animate-pulse">
              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />
              <span>LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 pt-24 md:pt-32">
        <AnimatePresence mode="wait">
          {!current ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4 md:space-y-6 max-w-md px-6"
            >
              <div className="mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-slate-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">No content available</h2>
              <p className="text-slate-500 text-sm md:text-base font-medium">There are no active broadcasts scheduled for this teacher at the moment.</p>
            </motion.div>
          ) : (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-200"
            >
              <Image 
                src={current.fileUrl} 
                alt={current.title} 
                fill
                priority
                className="object-contain" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 md:p-12 text-white">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2 md:space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white">{current.subject}</span>
                    <div className="flex items-center text-white/80 text-[10px] md:text-sm font-medium bg-black/20 backdrop-blur-md px-2 py-1 rounded-md">
                      <Clock className="mr-1.5 h-3 w-3 md:h-4 md:w-4" />
                      <span>Auto-rotating in {current.rotationDuration}s</span>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-lg">{current.title}</h2>
                  <p className="text-sm md:text-xl text-white/90 max-w-3xl line-clamp-2 font-medium drop-shadow-md">{current.description}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeContent.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {activeContent.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-500',
                idx === currentIndex ? 'bg-primary w-12' : 'bg-slate-200 w-4 hover:bg-slate-300'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
