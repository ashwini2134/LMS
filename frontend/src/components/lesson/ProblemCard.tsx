import { useState } from 'react';
import type { CodingProblem } from '../../types/lesson';
import CodeEditor from './CodeEditor';

const DIFF_COLOR: Record<string, string> = {
  easy:   'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  hard:   'text-red-400 bg-red-500/10 border-red-500/20',
};

interface ProblemCardProps {
  problem: CodingProblem;
  index: number;
  completed?: boolean;
  onComplete?: (id: string) => void;
}

export default function ProblemCard({ problem, index, completed, onComplete }: ProblemCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'description' | 'solution'>('description');
  const [testResults, setTestResults] = useState<Array<{ label: string; passed: boolean; actual: string }> | null>(null);
  const [allPassed, setAllPassed] = useState(completed ?? false);

  const handleRun = (_code: string, output: string, error: string | null) => {
    if (problem.testCases.length === 0) return;
    const results = problem.testCases.map(tc => {
      const actual = (error ? error : output).trim();
      const passed = actual === tc.expectedOutput.trim();
      return { label: tc.label, passed, actual };
    });
    setTestResults(results);
    if (results.every(r => r.passed)) {
      setAllPassed(true);
      onComplete?.(problem.id);
    }
  };

  const diffCls = DIFF_COLOR[problem.difficulty] ?? DIFF_COLOR.easy;

  if (!open) {
    return (
      <div
        className={`rounded-2xl border transition-all duration-200 cursor-pointer group
          ${allPassed
            ? 'border-green-500/25 bg-gradient-to-br from-green-600/8 to-slate-800/40'
            : 'border-slate-700/30 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:border-blue-500/30 hover:bg-slate-800/60'}`}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold
            ${allPassed ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/15 text-blue-400 group-hover:bg-blue-600/25'}`}>
            {allPassed ? '✓' : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
              {problem.title}
            </p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${diffCls}`}>
            {problem.difficulty}
          </span>
          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${allPassed ? 'border-green-500/25' : 'border-slate-700/30'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-800/40 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${diffCls}`}>
            {problem.difficulty}
          </span>
          <h3 className="text-sm font-semibold text-white">{problem.title}</h3>
          {allPassed && <span className="text-xs text-green-400">✓ Solved</span>}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/30 bg-slate-900/40">
        {(['description', 'solution'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-all ${
              tab === t ? 'text-blue-300 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/30 p-5 space-y-4">
        {tab === 'description' ? (
          <>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Editor */}
            <CodeEditor
              initialCode={problem.starterCode}
              language="python"
              height="220px"
              onRun={handleRun}
            />

            {/* Test results */}
            {testResults && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Results</p>
                {testResults.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                    r.passed ? 'border-green-700/30 bg-green-900/10' : 'border-red-700/30 bg-red-900/10'
                  }`}>
                    <span className={r.passed ? 'text-green-400' : 'text-red-400'}>
                      {r.passed ? '✓' : '✗'}
                    </span>
                    <span className="text-slate-300 flex-1">{r.label}</span>
                    {!r.passed && (
                      <span className="text-slate-500 font-mono truncate max-w-[200px]">
                        Got: {r.actual || '(no output)'}
                      </span>
                    )}
                  </div>
                ))}
                {allPassed && (
                  <div className="p-3 rounded-xl bg-green-900/20 border border-green-700/30 text-center">
                    <p className="text-sm font-semibold text-green-400">All tests passed!</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-[#0d1117] border border-slate-700/40 overflow-hidden">
            <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700/30">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Reference Solution</span>
            </div>
            <pre className="p-4 text-sm text-slate-200 font-mono leading-relaxed overflow-x-auto">
              {problem.solution || '# Solution coming soon'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
