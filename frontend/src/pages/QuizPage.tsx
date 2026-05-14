import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Spinner, PageHeader } from "../components";

export default function QuizPage() {
  const { slug, number } = useParams<{
    slug: string;
    number: string;
  }>();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const baseUrl =
          import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

        const response = await fetch(
          `${baseUrl}/data/${slug}/lecture_${number}/quiz.md`
        );

        if (!response.ok) {
          throw new Error("Quiz not found");
        }

        const text = await response.text();

        setContent(text);
        setErr("");
      } catch (e: any) {
        setErr(e.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [slug, number]);

  // Loading
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-blue-500" />
          <p className="text-slate-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error
  if (err) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-900">
        <div className="px-4 md:px-8 py-8">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 p-4">
            {err}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">

      {/* Header */}
      <div className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800/50 px-4 md:px-8 py-8">
        <PageHeader
          title={`Quiz ${number}`}
          subtitle={`Lecture ${number} Quiz`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: slug?.toUpperCase() || "Course" },
            { label: `Quiz ${number}` },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-8 py-8">
        <div className="mx-auto w-full max-w-4xl">

          <div className="markdown-content prose prose-invert prose-blue max-w-none overflow-hidden">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{

                h1: ({ node, ...props }) => (
                  <h1
                    className="text-3xl font-bold text-slate-100 mt-8 mb-4"
                    {...props}
                  />
                ),

                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl font-bold text-slate-200 mt-8 mb-4"
                    {...props}
                  />
                ),

                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl font-bold text-slate-300 mt-6 mb-3"
                    {...props}
                  />
                ),

                img: ({ src, ...props }) => {
                  const baseUrl =
                    import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

                  const resolvedSrc =
                    src &&
                    src.startsWith("/") &&
                    !/^https?:\/\//.test(src)
                      ? `${baseUrl}${src}`
                      : src;

                  return (
                    <img
                      src={resolvedSrc}
                      {...props}
                      className="my-6 rounded-lg w-full max-w-full mx-auto border border-slate-700"
                    />
                  );
                },

                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match?.[1] || "python"}
                      PreTag="div"
                      className="rounded-lg my-6 border border-slate-700"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-slate-800 px-2 py-1 rounded text-green-400 border border-slate-700 text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>

          </div>
        </div>
      </div>
    </div>
  );
}