
import React from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const kpiData = [
  { name: 'Jan', Leads: 320, MQLs: 120, SQLs: 48 },
  { name: 'Feb', Leads: 360, MQLs: 140, SQLs: 55 },
  { name: 'Mar', Leads: 410, MQLs: 165, SQLs: 62 },
  { name: 'Apr', Leads: 390, MQLs: 158, SQLs: 60 },
  { name: 'May', Leads: 445, MQLs: 180, SQLs: 70 },
  { name: 'Jun', Leads: 480, MQLs: 195, SQLs: 78 },
];

const channelData = [
  { name: 'Email', CTR: 3.2, Open: 28 },
  { name: 'LinkedIn', CTR: 2.5, Open: 0 },
  { name: 'X', CTR: 1.8, Open: 0 },
  { name: 'Blog', CTR: 6.1, Open: 0 },
  { name: 'Ads', CTR: 2.1, Open: 0 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Marketing Command Center</h1>
        <p className="text-slate-400 mt-1">AI-powered overview of funnel performance and channel KPIs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Leads (30d)"
          value="2,305"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          trend="4.2%"
          trendDirection="up"
        />
        <DashboardCard
          title="MQL Rate"
          value="31%"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          trend="1.3%"
          trendDirection="up"
        />
        <DashboardCard
          title="CPL (blended)"
          value="$42"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          trend="-3.1%"
          trendDirection="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Funnel Trends (6 Months)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="Leads" stroke="#38bdf8" strokeWidth={2} />
                <Line type="monotone" dataKey="MQLs" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="SQLs" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Channel KPIs</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="CTR" fill="#34d399" />
                <Bar dataKey="Open" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
