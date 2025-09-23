
import React, { useState, useCallback } from 'react';
import { analyzeSchedule } from '../services/geminiService';
import { ScheduleAnalysis, ScheduleRisk, ScheduleTask } from '../types';
import { Loader } from '../components/Loader';

const MOCK_PROJECT_DATA = `Tasks:
- T1: Foundation Pouring (10 days)
- T2: Framing (15 days), depends on T1
- T3: Roofing (8 days), depends on T2
- T4: Electrical Wiring (12 days), depends on T2
- T5: Plumbing (9 days), depends on T2
- T6: Drywall Installation (10 days), depends on T4, T5
- T7: Interior Painting (7 days), depends on T6
- T8: Exterior Siding (9 days), depends on T3
- T9: Final Inspection (2 days), depends on T7, T8`;

const RiskCard: React.FC<{ risk: ScheduleRisk }> = ({ risk }) => {
    const riskColor = risk.riskLevel === 'High' ? 'border-red-500' : risk.riskLevel === 'Medium' ? 'border-yellow-500' : 'border-green-500';
    return (
        <div className={`bg-slate-800 p-4 rounded-lg border-l-4 ${riskColor}`}>
            <h4 className="font-bold text-white">{risk.taskName} - <span className={`${riskColor.replace('border', 'text')}`}>{risk.riskLevel} Risk</span></h4>
            <p className="text-sm text-slate-400 mt-1">{risk.reason}</p>
        </div>
    );
};

const ScheduleTable: React.FC<{ tasks: ScheduleTask[] }> = ({ tasks }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase">
                <tr>
                    <th className="px-6 py-3">Task Name</th>
                    <th className="px-6 py-3">Start Date</th>
                    <th className="px-6 py-3">End Date</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Dependencies</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-4 font-medium text-white">{task.taskName}</td>
                        <td className="px-6 py-4">{task.startDate}</td>
                        <td className="px-6 py-4">{task.endDate}</td>
                        <td className="px-6 py-4">{task.durationDays} days</td>
                        <td className="px-6 py-4">{task.dependencies.join(', ') || 'None'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export const SchedulerView: React.FC = () => {
    const [projectData, setProjectData] = useState(MOCK_PROJECT_DATA);
    const [analysisResult, setAnalysisResult] = useState<ScheduleAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeSchedule(projectData);
            if (result) {
                setAnalysisResult(result);
            } else {
                setError("Failed to get a valid analysis from the AI. Please try again.");
            }
        } catch (e) {
            setError("An error occurred while communicating with the AI service.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [projectData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Project Scheduler</h1>
        <p className="text-slate-400 mt-1">Input your project tasks to generate an optimized schedule and identify potential risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Project Data Input</h2>
            <textarea
                value={projectData}
                onChange={(e) => setProjectData(e.target.value)}
                rows={15}
                className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Describe your project tasks, durations, and dependencies here..."
            />
            <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-transform transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? 'Analyzing...' : 'Generate & Analyze Schedule'}
            </button>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">AI Analysis & Schedule</h2>
            {isLoading && <Loader text="Optimizing schedule..."/>}
            {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}
            
            {analysisResult && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-sky-400 mb-2">Risk Analysis</h3>
                        <div className="space-y-3">
                            {analysisResult.riskAnalysis.map((risk, i) => <RiskCard key={i} risk={risk} />)}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-sky-400 mb-2">Optimized Schedule</h3>
                         <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <ScheduleTable tasks={analysisResult.optimizedSchedule} />
                        </div>
                    </div>
                </div>
            )}
            {!isLoading && !analysisResult && !error && (
                 <div className="flex items-center justify-center h-full p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                    <p>Analysis results will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
