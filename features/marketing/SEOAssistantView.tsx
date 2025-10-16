import React, { useState, useCallback } from 'react';
import { generateSEOAssist } from '../../services/geminiService';
import { SEOCluster, SEOOutline } from '../../types';
import { Loader } from '../../components/Loader';

export const SEOAssistantView: React.FC = () => {
  const [seed, setSeed] = useState('b2b marketing automation');
  const [audience, setAudience] = useState('Marketing operations leads at B2B SaaS');
  const [clusters, setClusters] = useState<SEOCluster[] | null>(null);
  const [outline, setOutline] = useState<SEOOutline | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setClusters(null);
    setOutline(null);

    try {
      const result = await generateSEOAssist(seed, audience);
      if (result) {
        setClusters(result.clusters);
        setOutline(result.outline);
      } else {
        setError('Failed to generate SEO assistance.');
      }
    } catch (e) {
      setError('An error occurred while generating SEO insights.');
    } finally {
      setIsLoading(false);
    }
  }, [seed, audience]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">SEO Assistant</h1>
        <p className="text-slate-400 mt-1">Generate keyword clusters and a complete article outline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Seed Keyword</label>
            <input value={seed} onChange={e => setSeed(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Audience</label>
            <input value={audience} onChange={e => setAudience(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 disabled:bg-slate-600">
            {isLoading ? 'Analyzing...' : 'Generate SEO Insights'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isLoading && <Loader text="Building clusters and outline..." />}
          {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}

          {!isLoading && !clusters && !outline && !error && (
            <div className="flex items-center justify-center h-full p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
              <p>SEO results will appear here.</p>
            </div>
          )}

          {clusters && (
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-2">Keyword Clusters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clusters.map((c, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-sky-300 font-semibold">{c.seedKeyword} — <span className="text-slate-400">{c.intent}</span></p>
                    <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1 max-h-48 overflow-y-auto">
                      {c.cluster.map((k, i) => (
                        <li key={i}>{k.keyword} • Vol {k.volume} • KD {k.difficulty}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outline && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-white mb-1">{outline.h1}</h3>
                <p className="text-sm text-slate-400">Meta Title: {outline.metaTitle}</p>
                <p className="text-sm text-slate-400">Meta Description: {outline.metaDescription}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-sky-400 mb-2">Sections</h4>
                <ol className="list-decimal list-inside text-slate-300 space-y-1">
                  {outline.sections.map((s, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="text-white font-medium">{s.h2}</span>
                      <ul className="list-disc list-inside ml-4 text-sm text-slate-400">
                        {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-sky-400 mb-2">FAQs</h4>
                <ul className="space-y-2">
                  {outline.faqs.map((f, i) => (
                    <li key={i} className="bg-slate-800 p-3 rounded border border-slate-700">
                      <p className="text-white font-medium">{f.question}</p>
                      <p className="text-slate-300 text-sm mt-1">{f.answer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
