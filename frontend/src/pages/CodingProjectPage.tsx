import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api, type ChatMsg } from "../api";

export default function CodingProjectPage() {
  const { slug, number, projectId } = useParams();

  // MARKDOWN CONTENT

  const [question, setQuestion] = useState("");
  const [understanding, setUnderstanding] = useState("");
  const [specification, setSpecification] = useState("");
  const [hints, setHints] = useState("");
  const [testing, setTesting] = useState("");

  // CODE

  const [code, setCode] = useState("");

  // OUTPUT

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | ""
  >("");
  const [syntaxError, setSyntaxError] = useState("");

  // CHAT
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      api.chatHistory(projectId).then(setChatMessages).catch(() => {});
    }
  }, [projectId]);

  // LOAD OPTIONAL FILE

  async function loadOptionalFile(path: string) {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        return "";
      }

      return await response.text();
    } catch {
      return "";
    }
  }

  // LOAD ALL FILES

  useEffect(() => {
    async function loadFiles() {
      try {
        const base = import.meta.env.BASE_URL;

        // QUESTION (REQUIRED)

        const questionResponse = await fetch(
          `${base}data/${slug}/lecture_${number}/${projectId}/question.md`
        );

        const questionText =
          await questionResponse.text();

        setQuestion(questionText);

        // OPTIONAL FILES

        setUnderstanding(
          await loadOptionalFile(
            `${base}data/${slug}/lecture_${number}/${projectId}/understanding.md`
          )
        );

        setSpecification(
          await loadOptionalFile(
            `${base}data/${slug}/lecture_${number}/${projectId}/specification.md`
          )
        );

        setHints(
          await loadOptionalFile(
            `${base}data/${slug}/lecture_${number}/${projectId}/hints.md`
          )
        );

        setTesting(
          await loadOptionalFile(
            `${base}data/${slug}/lecture_${number}/${projectId}/testing.md`
          )
        );

        // STARTER CODE
        
        const codeKey = `fa_code_${projectId}`;
        const savedCode = localStorage.getItem(codeKey);

        if (savedCode) {
          setCode(savedCode);
        } else {
          setCode("# Write a Python program below\n");
        }
      } catch (error) {
        console.error(error);

        setStatus("error");

        setOutput(
          "❌ Failed to load project files."
        );
      }
    }

    loadFiles();
  }, [slug, number, projectId]);

  // LOAD TEST MODULE

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || !projectId || isChatLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput("");
    setIsChatLoading(true);

    // Optimistically add user message
    const newMsg: ChatMsg = { role: "user", content: userMessage, created_at: new Date().toISOString() };
    setChatMessages(prev => [...prev, newMsg]);

    try {
      const { reply } = await api.chat(projectId, userMessage, code);
      setChatMessages(prev => [...prev, { role: "assistant", content: reply, created_at: new Date().toISOString() }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  }

  async function runDynamicTests() {
    const base = import.meta.env.BASE_URL;

    const testPath = `${base}data/${slug}/lecture_${number}/${projectId}/tests.js?t=${Date.now()}`;

    const response = await fetch(testPath);

    if (!response.ok) {
      throw new Error(
        `Tests not found for ${projectId}`
      );
    }

    const testText = await response.text();

    const blob = new Blob([testText], {
      type: "application/javascript",
    });

    const blobUrl =
      URL.createObjectURL(blob);

    try {
      const module = await import(
        /* @vite-ignore */
        blobUrl
      );

      if (
        !module ||
        typeof module.runTests !== "function"
      ) {
        throw new Error(
          "runTests(code) not found in tests.js"
        );
      }

      const result = await module.runTests(
        code
      );

      return result;
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  // RUN BUTTON

  async function handleRun() {
    setStatus("");
    setSyntaxError("");

    if (!code.trim()) {
      setStatus("error");

      setOutput(
        "❌ Code cannot be empty."
      );

      return;
    }

    setOutput("Running tests...");

    try {
      await new Promise(r => setTimeout(r, 300));
      const result =
        await runDynamicTests();

      if (result.passed || result.success) {
        setStatus("success");

        setOutput(
          result.message ||
            "✅ All test cases passed!"
        );
      } else {
        setStatus("error");

        setOutput(
          result.message ||
            "❌ Test cases failed."
        );
      }
    } catch (e: any) {
      console.error(e);

      setStatus("error");

      setOutput(
        `❌ Test execution failed.\n\n${
          e?.message || "Unknown error"
        }`
      );
    }
  }

  // SUBMIT BUTTON

  async function handleSubmit() {
    setStatus("");
    setSyntaxError("");

    if (!code.trim()) {
      setStatus("error");

      setOutput(
        "❌ Code cannot be empty."
      );

      return;
    }

    setOutput("Submitting code...");

    try {
      await new Promise(r => setTimeout(r, 300));
      const result =
        await runDynamicTests();

      if (result.passed || result.success) {
        setStatus("success");

        setOutput(
          "✅ Submission Successful!\n\nAll hidden test cases passed."
        );
      } else {
        setStatus("error");

        setOutput(
          `❌ Submission Failed.\n\n${
            result.message ||
            "Please review your logic."
          }`
        );
      }
    } catch (e: any) {
      console.error(e);

      setStatus("error");

      setOutput(
        `❌ Submission Failed.\n\n${
          e?.message || "Unknown error"
        }`
      );
    }
  }

  function handleSaveCode() {
    if (projectId) {
      localStorage.setItem(`fa_code_${projectId}`, code);
      setStatus("success");
      setOutput("✅ Code saved to local storage!");
    }
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setCode(val);
    
    // Very basic syntax check
    let errorMsg = "";
    const lines = val.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if ((line.startsWith("def ") || line.startsWith("if ") || line.startsWith("for ") || line.startsWith("while ") || line.startsWith("class ")) && !line.endsWith(":")) {
        errorMsg = `Line ${i + 1}: Missing colon (":") at the end of statement`;
        break;
      }
    }
    setSyntaxError(errorMsg);
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#0d1117] text-white">
      {/* LEFT PANEL */}

      <div
        className="
          w-full md:w-1/2
          overflow-y-auto
          border-b md:border-b-0 md:border-r
          border-slate-800
          p-8
          bg-[#0d1117]
        "
      >
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {projectId}
        </h1>

        {/* QUESTION */}

        <div
          className="
            prose
            prose-invert
            max-w-none
            mb-8
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {question}
          </ReactMarkdown>
        </div>

        {/* UNDERSTANDING */}

        {understanding && (
          <details
            className="
              mb-4
              rounded-xl
              border border-slate-700
              bg-slate-900
              p-5
            "
          >
            <summary
              className="
                cursor-pointer
                text-xl
                font-semibold
              "
            >
              Understanding
            </summary>

            <div
              className="
                mt-6
                prose
                prose-invert
                max-w-none
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {understanding}
              </ReactMarkdown>
            </div>
          </details>
        )}

        {/* SPECIFICATION */}

        {specification && (
          <details
            className="
              mb-4
              rounded-xl
              border border-slate-700
              bg-slate-900
              p-5
            "
          >
            <summary
              className="
                cursor-pointer
                text-xl
                font-semibold
              "
            >
              Specification
            </summary>

            <div
              className="
                mt-6
                prose
                prose-invert
                max-w-none
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {specification}
              </ReactMarkdown>
            </div>
          </details>
        )}

        {/* HINTS */}

        {hints && (
          <details
            className="
              mb-4
              rounded-xl
              border border-slate-700
              bg-slate-900
              p-5
            "
          >
            <summary
              className="
                cursor-pointer
                text-xl
                font-semibold
              "
            >
              Hints
            </summary>

            <div
              className="
                mt-6
                prose
                prose-invert
                max-w-none
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {hints}
              </ReactMarkdown>
            </div>
          </details>
        )}

        {/* TESTING */}

        {testing && (
          <details
            className="
              mb-4
              rounded-xl
              border border-slate-700
              bg-slate-900
              p-5
            "
          >
            <summary
              className="
                cursor-pointer
                text-xl
                font-semibold
              "
            >
              Testing
            </summary>

            <div
              className="
                mt-6
                prose
                prose-invert
                max-w-none
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {testing}
              </ReactMarkdown>
            </div>
          </details>
        )}

        {/* AI MENTOR */}

        <details
          className="
            mb-4
            rounded-xl
            border border-blue-900/50
            bg-blue-950/20
            p-5
          "
          open
        >
          <summary
            className="
              cursor-pointer
              text-xl
              font-semibold
              text-blue-400
            "
          >
            AI Mentor
          </summary>

          <div className="mt-6 flex flex-col h-80">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
              {chatMessages.length === 0 ? (
                <p className="text-slate-400 italic text-sm">Ask me for a hint!</p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm prose-sm prose-invert ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none text-slate-400 text-sm animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex gap-2 pt-2 border-t border-slate-700/50">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask for a hint..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </details>
      </div>

      {/* RIGHT PANEL */}

      <div className="w-full md:w-1/2 flex flex-col h-[50vh] md:h-screen">
        {/* TOP BAR */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
            py-4
            bg-[#161b22]
          "
        >
          <h2 className="text-xl font-semibold">
            Code Editor
          </h2>

          <div className="flex gap-4">
            <button
              onClick={handleSaveCode}
              aria-label="Save code to local storage"
              className="
                rounded-lg
                bg-slate-700
                px-5
                py-2
                font-semibold
                hover:bg-slate-600
              "
            >
              Save
            </button>

            <button
              onClick={handleRun}
              aria-label="Run code tests"
              className="
                rounded-lg
                bg-blue-600
                px-5
                py-2
                font-semibold
                hover:bg-blue-700
              "
            >
              Run
            </button>

            <button
              onClick={handleSubmit}
              aria-label="Submit code"
              className="
                rounded-lg
                bg-green-600
                px-5
                py-2
                font-semibold
                hover:bg-green-700
              "
            >
              Submit
            </button>
          </div>
        </div>

        {/* CODE EDITOR */}

        <div className="relative flex-1 overflow-hidden bg-[#0b0f14]">
          <textarea
            value={code}
            onChange={handleCodeChange}
            spellCheck="false"
            aria-label="Code Editor"
            className="
              absolute
              inset-0
              w-full
              h-full
              resize-none
              bg-transparent
              p-6
              font-mono
              text-transparent
              caret-white
              outline-none
              z-10
            "
            style={{ WebkitTextFillColor: "transparent" }}
          />
          <div className="absolute inset-0 w-full h-full p-6 overflow-hidden pointer-events-none">
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "inherit",
                fontFamily: "inherit",
                overflow: "hidden"
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
          {syntaxError && (
            <div className="absolute bottom-4 right-4 bg-red-900/80 text-red-200 px-4 py-2 rounded shadow border border-red-700 z-20 pointer-events-none">
              {syntaxError}
            </div>
          )}
        </div>

        {/* OUTPUT */}

        <div
          className={`
            h-44
            overflow-auto
            border-t
            border-slate-800
            p-4
            font-mono
            whitespace-pre-wrap
            ${
              status === "success"
                ? "text-green-400"
                : status === "error"
                ? "text-red-400"
                : "text-slate-300"
            }
          `}
        >
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}