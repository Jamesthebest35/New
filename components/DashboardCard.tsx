
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, trendDirection }) => {
  const trendColor = trendDirection === 'up' ? 'text-green-400' : 'text-red-400';
  const trendIcon = trendDirection === 'up' ? '↑' : '↓';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-lg text-sky-400">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${trendColor}`}>
          <span className="font-bold mr-1">{trendIcon} {trend}</span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
