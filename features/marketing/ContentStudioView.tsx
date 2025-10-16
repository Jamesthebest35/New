import React, { useState, useCallback } from 'react';
import { generateMarketingContent } from '../../services/geminiService';
import { ContentRequest, ContentOutput, ContentTone, ContentFormat, ContentLength } from '../../types';
import { Loader } from '../../components/Loader';

const tones: ContentTone[] = ['Informative', 'Persuasive', 'Friendly', 'Professional'];
const formats: ContentFormat[] = ['Blog', 'Email', 'Ad', 'Social'];
const lengths: ContentLength[] = ['Short', 'Medium', 'Long'];

export const ContentStudioView: React.FC = () => {
  const [topic, setTopic] = useState('AI marketing automation for B2B SaaS');
  const [audience, setAudience] = useState('Demand gen managers at mid-market B2B SaaS');
  const [tone, setTone] = useState<ContentTone>('Informative');
  const [format, setFormat] = useState<ContentFormat>('Blog');
  const [length, setLength] = useState<ContentLength>('Medium');
  const [keywords, setKeywords] = useState('marketing automation, workflow, lead scoring');
  const [cta, setCta] = useState('Book a demo');
  const [result, setResult] = useState<ContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const request: ContentRequest = {
      topic,
      audience,
      tone,
      format,
      length,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      callToAction: cta,
    };
    try {
      const output = await generateMarketingContent(request);
      if (output) {
        setResult(output);
      } else {
        setError('Failed to generate content.');
      }
    } catch (e) {
      setError('An error occurred while generating content.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [topic, audience, tone, format, length, keywords, cta]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Studio</h1>
        <p className="text-slate-400 mt-1">Generate high-quality blog, email, ad, and social content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Audience</label>
            <input value={audience} onChange={e => setAudience(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value as ContentTone)} className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md">
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value as ContentFormat)} className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md">
                {formats.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Length</label>
              <select value={length} onChange={e => setLength(e.target.value as ContentLength)} className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md">
                {lengths.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Keywords (comma-separated)</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Call To Action</label>
            <input value={cta} onChange={e => setCta(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 disabled:bg-slate-600">
            {isLoading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!isLoading && !result && !error && (
            <div className="flex items-center justify-center h-full p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
              <p>Content will appear here.</p>
            </div>
          )}
          {isLoading && <Loader text="Crafting copy..." />}
          {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}
          {result && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-bold text-white">{result.title}</h2>
                <p className="text-slate-400 mt-1">{result.summary}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 whitespace-pre-wrap text-slate-200">
                {result.body}
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-sky-400 mb-2">SEO Meta</h3>
                <p className="text-sm text-slate-300"><span className="text-slate-400">Title:</span> {result.seoMeta.title}</p>
                <p className="text-sm text-slate-300"><span className="text-slate-400">Description:</span> {result.seoMeta.description}</p>
                <p className="text-sm text-slate-300"><span className="text-slate-400">Keywords:</span> {result.seoMeta.keywords.join(', ')}</p>
              </div>
              {result.variants && result.variants.length > 0 && (
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="font-semibold text-white mb-2">Channel Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.variants.map((v, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">{v.channel}</p>
                        <p className="font-semibold text-sky-300">{v.headline}</p>
                        <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{v.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
