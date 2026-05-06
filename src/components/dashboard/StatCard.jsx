'use client';
import { Card } from '@/components/ui/Card';

export const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center space-x-4">
        <div className={`${color} rounded-lg p-3 text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 opacity-5">
        <Icon className="h-24 w-24" />
      </div>
    </Card>
  );
};
