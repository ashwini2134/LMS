import type { VisualAidBlock, VisualAidKind } from '../../types/lesson';

const ACCENT = {
  blue:   'border-blue-500/20 from-blue-600/10',
  purple: 'border-purple-500/20 from-purple-600/10',
  green:  'border-green-500/20 from-green-600/10',
  orange: 'border-orange-500/20 from-orange-600/10',
  amber:  'border-amber-500/20 from-amber-600/10',
};

function ComparisonChart({ block }: { block: VisualAidBlock }) {
  if (!block.comparison) return null;
  const { headers, rows } = block.comparison;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-700/40">
            <th className="text-left py-2 px-3 text-slate-400 font-medium" />
            {headers.map(h => (
              <th key={h} className="text-center py-2 px-3 text-slate-300 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800/40">
              <td className="py-2 px-3 text-slate-300 font-medium">{row.label}</td>
              {row.values.map((v, j) => (
                <td key={j} className={`text-center py-2 px-3 ${v === '✓' ? 'text-green-400' : v === '✗' ? 'text-red-400' : 'text-slate-300'}`}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DecisionTree({ block }: { block: VisualAidBlock }) {
  if (!block.steps) return null;
  return (
    <div className="flex flex-col items-center gap-3">
      {block.steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`px-4 py-2 rounded-xl border text-sm font-medium ${i === 0 ? 'bg-blue-600/20 border-blue-500/30 text-blue-300' : i === block.steps!.length - 1 ? 'bg-green-600/20 border-green-500/30 text-green-300' : 'bg-slate-800/60 border-slate-700/40 text-slate-200'}`}>
            {step.emoji && <span className="mr-1.5">{step.emoji}</span>}
            {step.label}
          </div>
          {i < block.steps.length - 1 && (
            <div className="flex flex-col items-center gap-1 py-1">
              <div className="border-l-2 border-dashed border-slate-600/50 h-4" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {i === 0 ? 'True' : i === block.steps.length - 2 ? 'Default' : 'Next'}
              </span>
              <div className="border-l-2 border-dashed border-slate-600/50 h-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProcessFlow({ block }: { block: VisualAidBlock }) {
  if (!block.flow) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {block.flow.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-500 text-lg">→</span>}
          <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
            {step.emoji && <span className="text-lg block mb-0.5">{step.emoji}</span>}
            <span className="text-xs text-slate-300">{step.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CycleDiagram({ block }: { block: VisualAidBlock }) {
  if (!block.steps) return null;
  return (
    <div className="flex flex-col items-center gap-1">
      {block.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {i === 0 && <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-[10px] text-green-400 shrink-0">S</div>}
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-200">
            {step.emoji && <span className="mr-1">{step.emoji}</span>}
            {step.label}
          </div>
          {i < block.steps.length - 1 ? (
            <span className="text-slate-500 text-xs">↓</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-xs">→</span>
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400">↺</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MemoryLayout({ block }: { block: VisualAidBlock }) {
  if (!block.items) return null;
  return (
    <div className="flex flex-wrap gap-1.5 items-end">
      {block.items.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="px-2.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700/40 text-center min-w-[60px]">
            <span className="text-xs text-slate-200 block">{item.value ?? item.label}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">{i}</span>
        </div>
      ))}
    </div>
  );
}

function MappingVisual({ block }: { block: VisualAidBlock }) {
  if (!block.items) return null;
  return (
    <div className="space-y-2">
      {block.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/25 text-blue-300 font-mono text-xs min-w-[80px] text-center">
            {item.emoji && <span className="mr-1">{item.emoji}</span>}
            {item.label}
          </div>
          <span className="text-slate-500">→</span>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-200 text-xs flex-1">
            {item.desc ?? item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function IndexVisual({ block }: { block: VisualAidBlock }) {
  if (!block.items) return null;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {block.items.map((item, i) => (
          <div key={i} className="px-2 py-1.5 rounded bg-slate-800/80 border border-slate-700/40 text-center min-w-[40px]">
            <span className="text-xs text-slate-200 font-mono">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5">
        {block.items.map((item, i) => (
          <div key={i} className="px-2 text-center min-w-[40px]">
            <span className="text-[10px] text-slate-500 font-mono">{i}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 mt-1">
        {block.items.map((item, i) => (
          <div key={i} className="px-2 text-center min-w-[40px]">
            <span className="text-[10px] text-slate-500 font-mono">{i - block.items!.length}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1 text-[10px] text-slate-500">
        <span>↑ Positive index</span>
        <span>↑ Negative index</span>
      </div>
    </div>
  );
}

function ArchitectureDiagram({ block }: { block: VisualAidBlock }) {
  if (!block.steps) return null;
  return (
    <div className="space-y-2">
      {block.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <div className="w-0.5 h-4 bg-slate-600/40 ml-5" />}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${
            i === 0 ? 'bg-blue-600/15 border-blue-500/25 text-blue-300 font-medium' :
            i === block.steps!.length - 1 ? 'bg-green-600/15 border-green-500/25 text-green-300 font-medium' :
            'bg-slate-800/60 border-slate-700/40 text-slate-200'
          }`}>
            {step.emoji && <span className="text-lg">{step.emoji}</span>}
            <span>{step.label}</span>
          </div>
          {i < block.steps.length - 1 && (
            <span className="text-slate-500 text-xs ml-1">↓</span>
          )}
        </div>
      ))}
    </div>
  );
}

function LifecycleDiagram({ block }: { block: VisualAidBlock }) {
  if (!block.steps) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {block.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-500 text-lg">→</span>}
          <div className={`px-3 py-2 rounded-xl border text-center text-xs ${
            step.label.startsWith('Open:') ? 'bg-green-600/15 border-green-500/25 text-green-300' :
            step.label.startsWith('Close:') ? 'bg-red-600/15 border-red-500/25 text-red-300' :
            'bg-slate-800/60 border-slate-700/40 text-slate-200'
          }`}>
            {step.emoji && <span className="mr-1">{step.emoji}</span>}
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransformationDemo({ block }: { block: VisualAidBlock }) {
  if (!block.items) return null;
  return (
    <div className="space-y-2">
      {block.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-300 font-mono min-w-[100px] text-center">
            {item.label}
          </div>
          <span className="text-slate-500 text-sm">→</span>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-mono text-center flex-1 ${
            item.desc ? 'bg-blue-600/15 border border-blue-500/25 text-blue-300' : 'bg-slate-800/60 border border-slate-700/40 text-slate-300'
          }`}>
            {item.desc ?? item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparisonGrid({ block }: { block: VisualAidBlock }) {
  if (!block.columns) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {block.columns.map((col, i) => (
        <div key={i} className="rounded-xl bg-slate-900/60 border border-slate-700/30 p-3">
          <p className="text-xs font-semibold text-slate-300 mb-2 text-center border-b border-slate-700/30 pb-2">
            {col.header}
          </p>
          <ul className="space-y-1.5">
            {col.items.map((item, j) => (
              <li key={j} className="flex items-center gap-1.5 text-xs text-slate-400">
                {item.emoji && <span>{item.emoji}</span>}
                <span>{item.label}</span>
                {item.desc && <span className="text-slate-500">— {item.desc}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function renderVisual(kind: VisualAidKind, block: VisualAidBlock) {
  switch (kind) {
    case 'comparison_chart': return <ComparisonChart block={block} />;
    case 'decision_tree': return <DecisionTree block={block} />;
    case 'process_flow': return <ProcessFlow block={block} />;
    case 'cycle_diagram': return <CycleDiagram block={block} />;
    case 'memory_layout': return <MemoryLayout block={block} />;
    case 'mapping_visual': return <MappingVisual block={block} />;
    case 'index_visual': return <IndexVisual block={block} />;
    case 'architecture_diagram': return <ArchitectureDiagram block={block} />;
    case 'lifecycle_diagram': return <LifecycleDiagram block={block} />;
    case 'transformation_demo': return <TransformationDemo block={block} />;
    case 'comparison_grid': return <ComparisonGrid block={block} />;
    default: return null;
  }
}

const KIND_ICONS: Record<VisualAidKind, string> = {
  comparison_chart: 'Chart',
  process_flow: 'Flow',
  decision_tree: 'Tree',
  iteration_diagram: 'Loop',
  cycle_diagram: 'Cycle',
  memory_layout: 'Memory',
  mapping_visual: 'Map',
  index_visual: 'Index',
  architecture_diagram: 'Arch',
  lifecycle_diagram: 'Life',
  transformation_demo: 'Xform',
  comparison_grid: 'Grid',
};

export default function VisualAidCard({ block }: { block: VisualAidBlock }) {
  const accent = ACCENT[block.accentColor ?? 'blue'] ?? ACCENT.blue;
  return (
    <div className={`rounded-2xl border ${accent} bg-gradient-to-br to-slate-800/40 backdrop-blur-sm p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">{KIND_ICONS[block.kind]}</span>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{block.title}</p>
      </div>
      {renderVisual(block.kind, block)}
      {block.code && (
        <div className="mt-4 rounded-xl bg-[#0d1117] border border-slate-700/40 overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-800/40 border-b border-slate-700/30 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-[10px] text-slate-500 font-medium uppercase">{block.language ?? 'python'}</span>
          </div>
          <pre className="p-4 text-sm leading-relaxed font-mono">
            <code className="text-slate-200">{block.code}</code>
          </pre>
          {block.output && (
            <div className="border-t border-slate-700/30 px-4 py-2 bg-slate-900/60">
              <span className="text-[10px] text-slate-500 uppercase mr-2">Output:</span>
              <span className="text-xs text-green-400 font-mono">{block.output}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
