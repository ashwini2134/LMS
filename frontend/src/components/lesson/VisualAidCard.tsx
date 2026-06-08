import type { VisualAidBlock, VisualAidKind } from '../../types/lesson';

/* ── 1. Index Visual (array cells with labeled indices) ────────────────── */

function IndexVisual({ block }: { block: VisualAidBlock }) {
  const items = block.items;
  if (!items) return null;
  return (
    <div className="flex flex-col items-center py-2">
      <div className="flex gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="px-3 py-3 rounded-lg bg-gradient-to-b from-blue-600/80 to-blue-700/80 text-white text-xs font-bold font-mono text-center min-w-[52px] border border-blue-400/30 shadow-md">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        {items.map((_item, i) => (
          <div key={i} className="min-w-[52px] text-center">
            <div className="w-full h-0.5 bg-blue-500/40 mb-0.5" />
            <span className="text-[10px] text-blue-400 font-mono font-medium">+{i}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-0.5">
        {items.map((_item, i) => (
          <div key={i} className="min-w-[52px] text-center">
            <div className="w-full h-px bg-amber-500/30 mb-0.5" />
            <span className="text-[10px] text-amber-400 font-mono font-medium">-{items.length - i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Mapping Visual (key → value with arrow connector) ───────────── */

function MappingVisual({ block }: { block: VisualAidBlock }) {
  const items = block.items;
  if (!items) return null;
  return (
    <div className="space-y-1 py-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm group">
          <div className="px-3 py-2 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-300 font-mono text-xs font-semibold min-w-[80px] text-center shadow-sm">
            {item.label}
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-4 h-4 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/40 text-slate-200 text-xs flex-1 shadow-sm">
            {item.desc ?? item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 3. Transformation Demo (before → after with animated arrow) ──────── */

function TransformationDemo({ block }: { block: VisualAidBlock }) {
  const items = block.items;
  if (!items) return null;
  return (
    <div className="space-y-1 py-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-600/40 text-xs text-slate-300 font-mono min-w-[90px] text-center shadow-sm">
            {item.label}
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-4 h-4 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-[8px] text-amber-500 font-semibold uppercase">apply</span>
          </div>
          <div className={`px-3 py-2.5 rounded-lg text-xs font-mono text-center flex-1 shadow-sm ${
            item.desc ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-300' : 'bg-slate-800/60 border border-slate-600/40 text-slate-300'
          }`}>
            {item.desc ?? item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Dispatch ─────────────────────────────────────────────────────────── */

function renderVisual(kind: VisualAidKind, block: VisualAidBlock) {
  switch (kind) {
    case 'index_visual': return <IndexVisual block={block} />;
    case 'mapping_visual': return <MappingVisual block={block} />;
    case 'transformation_demo': return <TransformationDemo block={block} />;
    default: return null;
  }
}

const KIND_TITLES: Record<string, string> = {
  index_visual: 'Index',
  mapping_visual: 'Mapping',
  transformation_demo: 'Transformation',
};

export default function VisualAidCard({ block }: { block: VisualAidBlock }) {
  const kindTitle = KIND_TITLES[block.kind] ?? 'Visual';

  return (
    <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-2.5 bg-slate-800/40 border-b border-slate-700/20 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-700/30 px-2 py-0.5 rounded">
          {kindTitle}
        </span>
        <span className="text-xs font-semibold text-slate-200">{block.title}</span>
      </div>

      {/* Visual */}
      <div className="px-5 py-4">
        {renderVisual(block.kind, block)}
      </div>

      {/* Optional code example */}
      {block.code && (
        <div className="border-t border-slate-700/20 bg-[#0d1117]">
          <div className="px-5 py-1.5 bg-slate-800/30 border-b border-slate-700/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[10px] text-slate-500 font-medium uppercase">{block.language ?? 'python'}</span>
          </div>
          <pre className="px-5 py-3 text-sm leading-relaxed font-mono text-slate-200 overflow-x-auto">{block.code}</pre>
          {block.output && (
            <div className="border-t border-slate-700/20 px-5 py-2 bg-slate-900/50">
              <span className="text-[10px] text-slate-500 uppercase mr-2 font-semibold">Output:</span>
              <span className="text-xs text-emerald-400 font-mono">{block.output}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
