import { useState } from 'react';
import type { PracticeBlock } from '../../types/lesson';
import CodeEditor from './CodeEditor';

interface PracticeCardProps {
  block: PracticeBlock;
  onAttempt?: () => void;
  onComplete?: () => void;
}

export default function PracticeCard({ block, onAttempt, onComplete }: PracticeCardProps) {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleRun = (_code: string, output: string, error: string | null) => {
    onAttempt?.();
    if (!error && block.expectedOutput && output.trim() === block.expectedOutput.trim()) {
      setPassed(true);
      onComplete?.();
    }
  };

  if (!open) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-600/10 to-slate-800/40 backdrop-blur-sm p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">Practice Exercise</p>
            <p className="text-sm font-medium text-slate-200 mb-1">{block.title}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{block.instructions}</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-600 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Open Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-5 space-y-4 ${
      passed ? 'border-green-500/30 bg-gradient-to-br from-green-600/10 to-slate-800/40' : 'border-amber-500/20 bg-gradient-to-br from-amber-600/10 to-slate-800/40'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${passed ? 'text-green-300' : 'text-amber-300'}`}>
            Practice Exercise {passed && '✓ Completed'}
          </p>
          <p className="text-sm font-medium text-slate-200">{block.title}</p>
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

      {/* Instructions */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
        <p className="text-sm text-slate-300 leading-relaxed">{block.instructions}</p>
        {block.expectedOutput && (
          <p className="text-xs text-slate-500 mt-2">
            Expected output: <code className="text-green-400 font-mono">{block.expectedOutput}</code>
          </p>
        )}
      </div>

      {/* Editor */}
      <CodeEditor
        initialCode={block.starterCode}
        language="python"
        height="200px"
        expectedOutput={block.expectedOutput}
        onRun={handleRun}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowHint(v => !v)}
          className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
        >
          {showHint ? 'Hide Hint' : 'Hint'}
        </button>
        <button
          onClick={() => setShowSolution(v => !v)}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700/70 border border-slate-700/40 transition-all"
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {showHint && (
        <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-700/30">
          <p className="text-xs font-semibold text-blue-400 mb-1">Hint</p>
          <p className="text-sm text-slate-300">{block.hint}</p>
        </div>
      )}

      {showSolution && (
        <div className="rounded-xl bg-[#0d1117] border border-slate-700/40 overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-slate-800/40 border-b border-slate-700/30">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Solution</span>
          </div>
          <pre className="p-4 text-sm text-slate-200 font-mono leading-relaxed">{block.solution}</pre>
        </div>
      )}
    </div>
  );
}
