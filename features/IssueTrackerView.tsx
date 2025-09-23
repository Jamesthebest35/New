
import React, { useState, useCallback, ChangeEvent } from 'react';
import { analyzeIssue } from '../services/geminiService';
import { Issue, IssueAnalysis } from '../types';
import { Loader } from '../components/Loader';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const mockIssues: Issue[] = [
    {
        id: 1,
        description: "Exposed rebar on column C4, level 2. Poses a significant safety hazard.",
        image: "https://picsum.photos/seed/rebar/400/300",
        analysis: {
            category: "Safety",
            priority: "Critical",
            suggestedSteps: ["Immediately cordon off the area.", "Notify the site safety officer.", "Schedule immediate remediation with the concrete team."]
        }
    },
    {
        id: 2,
        description: "Incorrect window type (W-02 instead of W-03) installed on the north facade.",
        image: "https://picsum.photos/seed/window/400/300",
        analysis: {
            category: "Quality",
            priority: "High",
            suggestedSteps: ["Halt further window installations on the north facade.", "Verify the window delivery logs against the architectural plans.", "Submit a change order request or schedule replacement."]
        }
    }
];

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => {
    const priorityColors = {
        'Critical': 'bg-red-500', 'High': 'bg-orange-500', 'Medium': 'bg-yellow-500', 'Low': 'bg-green-500'
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            {issue.image && <img src={issue.image} alt={`Issue ${issue.id}`} className="w-full h-48 object-cover" />}
            <div className="p-4">
                <p className="text-slate-300 mb-4">{issue.description}</p>
                {issue.analysis ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-400">Category: <span className="text-sky-400">{issue.analysis.category}</span></span>
                            <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${priorityColors[issue.analysis.priority]}`}>{issue.analysis.priority}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-200 mb-1">Suggested Steps:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                {issue.analysis.suggestedSteps.map((step, i) => <li key={i}>{step}</li>)}
                            </ul>
                        </div>
                    </div>
                ) : <div className="text-center text-slate-500">Awaiting AI analysis...</div>}
            </div>
        </div>
    );
}

export const IssueTrackerView: React.FC = () => {
    const [issues, setIssues] = useState<Issue[]>(mockIssues);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!description) {
            setError("Description is required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const imageBase64 = imageFile ? await toBase64(imageFile) : null;
            const analysisResult = await analyzeIssue(description, imageBase64);
            
            if (analysisResult) {
                const newIssue: Issue = {
                    id: Date.now(),
                    description,
                    image: imagePreview || undefined,
                    analysis: analysisResult
                };
                setIssues(prev => [newIssue, ...prev]);
                // Reset form
                setDescription('');
                setImageFile(null);
                setImagePreview(null);
            } else {
                 setError("Failed to get a valid analysis from the AI. Please try again.");
            }
        } catch (e) {
            setError("An error occurred while submitting the issue.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [description, imageFile, imagePreview]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">AI-Powered Issue Tracker</h1>
                <p className="text-slate-400 mt-1">Report on-site issues and receive instant AI analysis and resolution steps.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 p-6 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-white">Report a New Issue</h2>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5} 
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Describe the issue in detail..."
                    />
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Attach Image (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500/10 file:text-sky-300 hover:file:bg-sky-500/20"/>
                    </div>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg w-full object-cover" />}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-transform transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? <><Loader text="Analyzing..." /></> : 'Submit & Analyze Issue'}
                    </button>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-xl font-bold text-white">Active Issues</h2>
                     {isLoading && issues.length === mockIssues.length && <Loader text="Analyzing new issue..."/>}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};
