
import React from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', 'On Track': 30, 'Delayed': 5 },
  { name: 'Feb', 'On Track': 35, 'Delayed': 3 },
  { name: 'Mar', 'On Track': 42, 'Delayed': 4 },
  { name: 'Apr', 'On Track': 38, 'Delayed': 7 },
  { name: 'May', 'On Track': 45, 'Delayed': 6 },
  { name: 'Jun', 'On Track': 50, 'Delayed': 5 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Project Command Center</h1>
        <p className="text-slate-400 mt-1">Welcome back, here's your AI-powered project overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Projects on Track"
          value="45 / 58"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          trend="2.5%"
          trendDirection="up"
        />
        <DashboardCard
          title="Critical Issues"
          value="7"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          trend="5.1%"
          trendDirection="down"
        />
        <DashboardCard
          title="Resource Utilization"
          value="82%"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          trend="1.8%"
          trendDirection="up"
        />
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">Project Health Trend (6 Months)</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="On Track" stackId="a" fill="#22c55e" />
                <Bar dataKey="Delayed" stackId="a" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
