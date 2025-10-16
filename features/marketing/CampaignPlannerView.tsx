import React, { useState, useCallback } from 'react';
import { planCampaign } from '../../services/geminiService';
import { CampaignObjective, CampaignPlan } from '../../types';
import { Loader } from '../../components/Loader';

const objectives: CampaignObjective[] = ['Awareness', 'Engagement', 'LeadGen', 'Conversion'];

export const CampaignPlannerView: React.FC = () => {
  const [campaignName, setCampaignName] = useState('Q4 Pipeline Acceleration');
  const [objective, setObjective] = useState<CampaignObjective>('LeadGen');
  const [audience, setAudience] = useState('US-based mid-market IT leaders evaluating automation tools');
  const [themes, setThemes] = useState('automation ROI, security, scalability');
  const [channels, setChannels] = useState('Email, LinkedIn, Blog, Ads');

  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const planResult = await planCampaign(
        campaignName,
        objective,
        audience,
        themes.split(',').map(t => t.trim()).filter(Boolean),
        channels.split(',').map(c => c.trim()).filter(Boolean)
      );
      if (planResult) {
        setPlan(planResult);
      } else {
        setError('Failed to generate campaign plan.');
      }
    } catch (e) {
      setError('An error occurred while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  }, [campaignName, objective, audience, themes, channels]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Campaign Planner</h1>
        <p className="text-slate-400 mt-1">Create a campaign brief, channel strategy, and content calendar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name</label>
            <input value={campaignName} onChange={e => setCampaignName(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Objective</label>
            <select value={objective} onChange={e => setObjective(e.target.value as CampaignObjective)} className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md">
              {objectives.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
            <input value={audience} onChange={e => setAudience(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Key Themes (comma-separated)</label>
            <input value={themes} onChange={e => setThemes(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Channels (comma-separated)</label>
            <input value={channels} onChange={e => setChannels(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <button onClick={handlePlan} disabled={isLoading} className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 disabled:bg-slate-600">
            {isLoading ? 'Planning...' : 'Generate Plan'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!isLoading && !plan && !error && (
            <div className="flex items-center justify-center h-full p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
              <p>Campaign plan will appear here.</p>
            </div>
          )}
          {isLoading && <Loader text="Drafting strategy..." />}
          {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}

          {plan && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-bold text-white">{plan.campaignName}</h2>
                <p className="text-slate-400 mt-1">Objective: {plan.objective} • Audience: {plan.targetAudience}</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-sky-400 mb-2">Channels</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {plan.channels.map((c, idx) => (
                    <li key={idx}><span className="text-white font-medium">{c.channel}</span>: {c.cadence} • {c.contentTypes.join(', ')}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 overflow-x-auto">
                <h3 className="font-semibold text-sky-400 mb-2">Content Calendar (2 weeks)</h3>
                <table className="w-full text-left">
                  <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Channel</th>
                      <th className="px-4 py-2">Content</th>
                      <th className="px-4 py-2">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.contentCalendar.map((item, i) => (
                      <tr key={i} className="bg-slate-800 border-b border-slate-700">
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">{item.channel}</td>
                        <td className="px-4 py-2">{item.contentTitle} — <span className="text-slate-400">{item.description}</span></td>
                        <td className="px-4 py-2">{item.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-sky-400 mb-2">KPI Targets</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.kpis.map((kpi, idx) => (
                    <li key={idx} className="bg-slate-800 p-3 rounded border border-slate-700">
                      <span className="text-white font-semibold">{kpi.name}</span>
                      <span className="text-slate-400"> — Target: {kpi.target}{kpi.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-white mb-2">Campaign Brief</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{plan.brief}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
