'use client';
// Teacher Dashboard: Overview of content statistics and quick actions.
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import ContentService from '@/services/content.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    const data = await ContentService.getStats(user.id);
    setStats(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: 'Total Uploaded', value: stats?.total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending Approval', value: stats?.pending, icon: Clock, color: 'bg-amber-500' },
    { label: 'Approved Content', value: stats?.approved, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Rejected Content', value: stats?.rejected, icon: XCircle, color: 'bg-rose-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here&apos;s your content overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonLoader key={i} type="stats" />)
        ) : (
          statCards.map((stat, i) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} rounded-lg p-3 text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-5">
                <stat.icon className="h-24 w-24" />
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Broadcast Activity</span>
            </h3>
          </div>
          <div className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-48 w-full bg-slate-50 rounded-xl flex items-end justify-between p-4 space-x-2">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="w-full bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Simulated activity for the last 7 days</p>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center space-y-6 bg-primary/5 border-primary/20">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-xl font-bold">Ready to broadcast?</h3>
            <p className="text-muted-foreground mt-2">Upload new educational content and reach your students instantly.</p>
          </div>
          <Button onClick={() => window.location.href='/teacher/upload'}>
            Upload New Content
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}

