
import React, { useState, useCallback } from 'react';
import { generateResourceAllocation } from '../services/geminiService';
import { AllocationPlan, ResourceAllocation } from '../types';
import { Loader } from '../components/Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const MOCK_TASKS = `
- Concrete Pouring, Section A (High Priority)
- Steel Beam Installation, Level 3 (High Priority)
- Electrical Rough-in, Level 2 (Medium Priority)
- Site Cleanup, Zone D (Low Priority)`;

const MOCK_RESOURCES = `
- Labor:
  - 5x Concrete Finishers
  - 3x Ironworkers
  - 4x Electricians
  - 6x General Laborers
- Equipment:
  - 1x Concrete Pump Truck
  - 2x Cranes
  - 1x Excavator
  - 3x Scissor Lifts`;

const AllocationTable: React.FC<{ allocations: ResourceAllocation[] }> = ({ allocations }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase">
                <tr>
                    <th className="px-6 py-3">Resource Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Assigned Task</th>
                    <th className="px-6 py-3">Shift</th>
                </tr>
            </thead>
            <tbody>
                {allocations.map((alloc, i) => (
                    <tr key={i} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-4 font-medium text-white">{alloc.resourceName}</td>
                        <td className="px-6 py-4">{alloc.resourceType}</td>
                        <td className="px-6 py-4">{alloc.assignedTask}</td>
                        <td className="px-6 py-4"><span className="bg-sky-900/50 text-sky-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{alloc.shift}</span></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const COLORS = ['#0ea5e9', '#34d399', '#f59e0b', '#ef4444']; // sky, emerald, amber, red

export const ResourceManagerView: React.FC = () => {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [resources, setResources] = useState(MOCK_RESOURCES);
    const [allocationPlan, setAllocationPlan] = useState<AllocationPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAllocationPlan(null);
        try {
            const result = await generateResourceAllocation(tasks, resources);
            if (result) {
                setAllocationPlan(result);
            } else {
                setError("Failed to get a valid allocation plan from the AI.");
            }
        } catch (e) {
            setError("An error occurred while communicating with the AI service.");
        } finally {
            setIsLoading(false);
        }
    }, [tasks, resources]);
    
    const chartData = allocationPlan ? allocationPlan.allocations.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.assignedTask);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: curr.assignedTask, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]) : [];


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">AI Resource Manager</h1>
                <p className="text-slate-400 mt-1">Optimize your workforce and equipment allocation with AI-driven insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Today's Tasks</h2>
                        <textarea value={tasks} onChange={e => setTasks(e.target.value)} rows={6} className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                     <div>
                        <h2 className="text-xl font-bold text-white mb-2">Available Resources</h2>
                        <textarea value={resources} onChange={e => setResources(e.target.value)} rows={10} className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-transform transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Optimizing...' : 'Generate Allocation Plan'}
                    </button>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white">Optimal Allocation Plan</h2>
                    {isLoading && <Loader text="Generating optimal plan..."/>}
                    {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}
                    
                    {allocationPlan && (
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <h3 className="font-semibold text-sky-400 mb-1">AI Strategy Summary</h3>
                                <p className="text-sm text-slate-300">{allocationPlan.summary}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden p-4">
                                    <h3 className="font-semibold text-white mb-2">Detailed Allocations</h3>
                                    <AllocationTable allocations={allocationPlan.allocations} />
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                     <h3 className="font-semibold text-white mb-2">Resource Distribution by Task</h3>
                                     <div style={{width: '100%', height: 250}}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {!isLoading && !allocationPlan && !error && (
                        <div className="flex items-center justify-center h-full p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                            <p>Allocation plan will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
