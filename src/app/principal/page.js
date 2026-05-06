'use client';
// Principal Dashboard: Institution-wide content overview and system monitoring.
import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import ContentService from '@/services/content.service';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function PrincipalDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await ContentService.getStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Content', value: stats?.total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending Approvals', value: stats?.pending, icon: Clock, color: 'bg-amber-500' },
    { label: 'Approved', value: stats?.approved, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Rejected', value: stats?.rejected, icon: XCircle, color: 'bg-rose-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center space-x-4">
        <div className="rounded-xl bg-primary/10 p-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
          <p className="text-muted-foreground">Manage and review all broadcasting content across the institution.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonLoader key={i} type="stats" />)
        ) : (
          statCards.map((stat) => (
            <StatCard 
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))
        )}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-6 text-xl font-bold">System Status</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-border">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold">Broadcast Server</p>
                  <p className="text-sm text-muted-foreground">Operational and healthy</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">ONLINE</span>
            </div>
            
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-border">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Active Teachers</p>
                  <p className="text-sm text-muted-foreground">12 teachers currently active</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">12 ACTIVE</span>
            </div>
          </div>
        </Card>

        <Card className="bg-primary text-white">
          <h3 className="mb-4 text-xl font-bold">Approval Queue</h3>
          <p className="mb-8 text-primary-foreground/80">
            There are currently <strong>{stats?.pending || 0}</strong> items waiting for your review.
          </p>
          <button 
            onClick={() => window.location.href='/principal/approvals'}
            className="w-full rounded-xl bg-white py-3 font-bold text-primary transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Review Pending Content
          </button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
