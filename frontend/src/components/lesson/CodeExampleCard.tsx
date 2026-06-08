import { useState } from 'react';
import type { CodeExampleBlock } from '../../types/lesson';
import CodeEditor from './CodeEditor';

export default function CodeExampleCard({ block }: { block: CodeExampleBlock }) {
  const [interactive, setInteractive] = useState(false);

  if (interactive) {
    return (
      <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {block.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 bg-slate-700/30 px-2 py-0.5 rounded font-medium">Playground</span>
            <button
              onClick={() => setInteractive(false)}
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-700/40 hover:bg-slate-700/70 transition-all"
            >
              Read-only view
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3">Edit the code and run it. No scoring — experiment freely.</p>
        <CodeEditor
          initialCode={block.code}
          language={block.language}
          height="180px"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {block.title}
        </h3>
        <button
          onClick={() => setInteractive(true)}
          className="text-[11px] text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
        >
          Try it →
        </button>
      </div>

      {/* Static code display */}
      <div className="rounded-xl bg-[#0d1117] border border-slate-700/40 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/40 border-b border-slate-700/30">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
            {block.language}
          </span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-slate-200 font-mono">{block.code}</code>
        </pre>
      </div>

      {block.expectedOutput !== undefined && (
        <div className="mt-3 rounded-xl bg-slate-900/80 border border-slate-700/30 overflow-hidden">
          <div className="px-4 py-1.5 bg-slate-800/40 border-b border-slate-700/30">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Output</span>
          </div>
          <pre className="p-4 text-sm text-green-400 font-mono select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{block.expectedOutput}</pre>
        </div>
      )}
    </div>
  );
}
