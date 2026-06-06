import { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { runPython } from '../../utils/pythonRunner';

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
  showRunButton?: boolean;
  showCopyButton?: boolean;
  showResetButton?: boolean;
  expectedOutput?: string;
  onChange?: (code: string) => void;
  onRun?: (code: string, output: string, error: string | null) => void;
}

export default function CodeEditor({
  initialCode,
  language = 'python',
  readOnly = false,
  height = '180px',
  showRunButton = true,
  showCopyButton = true,
  showResetButton = true,
  expectedOutput,
  onChange,
  onRun,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const editorRef = useRef<any>(null);

  const handleChange = (val: string | undefined) => {
    const v = val ?? '';
    setCode(v);
    onChange?.(v);
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setOutput(null);
    setRunError(null);
    // Small delay so the UI updates before the potentially blocking eval
    await new Promise(r => setTimeout(r, 50));
    try {
      const result = runPython(code);
      setOutput(result.output);
      setRunError(result.error);
      onRun?.(code, result.output, result.error);
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    setRunError(null);
    editorRef.current?.setValue(initialCode);
  };

  const isCorrect = expectedOutput !== undefined && output !== null &&
    output.trim() === expectedOutput.trim();

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/40 bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/60 border-b border-slate-700/40">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider flex-1">
          {language}
        </span>
        <div className="flex items-center gap-1">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200 rounded bg-slate-700/40 hover:bg-slate-700/70 transition-all"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          {showResetButton && !readOnly && (
            <button
              onClick={handleReset}
              className="px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200 rounded bg-slate-700/40 hover:bg-slate-700/70 transition-all"
            >
              Reset
            </button>
          )}
          {showRunButton && !readOnly && (
            <button
              onClick={handleRun}
              disabled={running}
              className="px-3 py-1 text-[10px] font-semibold text-white rounded bg-green-600/80 hover:bg-green-600 disabled:opacity-50 transition-all flex items-center gap-1"
            >
              {running ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Run
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height={height}
        language={language}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        onMount={(editor) => { editorRef.current = editor; }}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 10, bottom: 10 },
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          renderLineHighlight: 'line',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: 'hidden', horizontal: 'hidden', alwaysConsumeMouseWheel: false },
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
        }}
      />

      {/* Output */}
      {(output !== null || runError) && (
        <div className={`border-t ${runError ? 'border-red-700/40' : isCorrect ? 'border-green-700/40' : 'border-slate-700/40'}`}>
          <div className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2 ${
            runError ? 'bg-red-900/20 text-red-400' : isCorrect ? 'bg-green-900/20 text-green-400' : 'bg-slate-800/40 text-slate-400'
          }`}>
            {runError ? (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Error</>
            ) : isCorrect ? (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Correct!</>
            ) : 'Output'}
          </div>
          <pre className={`px-4 py-3 text-sm font-mono leading-relaxed ${runError ? 'text-red-300' : 'text-green-300'}`}>
            {runError || output}
          </pre>
        </div>
      )}
    </div>
  );
}
