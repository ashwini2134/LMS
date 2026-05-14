import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function SolutionPage() {

  const { slug, number, projectId } = useParams();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadContent() {

      try {

        setLoading(true);
        setError("");

        // Handles Vite base URL like /LMS/
        const baseUrl =
          import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

        const response = await fetch(
          `${baseUrl}/data/${slug}/lecture_${number}/${projectId}/solution.md`
        );

        if (!response.ok) {
          throw new Error("Solution file not found");
        }

        const text = await response.text();

        setContent(text);

      } catch (err: any) {

        setError(err.message || "Failed to load solution");

      } finally {

        setLoading(false);

      }
    }

    loadContent();

  }, [slug, number, projectId]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading solution...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen p-8 text-red-400">
        {error}
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">

        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">

          <div>

            <p className="text-slate-400 mb-2">
              Lecture {number} Solution
            </p>

            <h1 className="text-5xl font-bold capitalize">
              {projectId?.replace("-", " ")} Solution
            </h1>

          </div>

          {/* Back Button */}
          <Link
            to={`/course/${slug}/lecture/${number}/project/${projectId}`}
            className="
              px-5 py-3
              rounded-xl
              bg-slate-700
              hover:bg-slate-600
              transition-colors
              font-semibold
            "
          >
            Back to Project
          </Link>

        </div>

      </div>

      {/* Markdown Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">

        <div className="
          prose
          prose-invert
          max-w-none
          prose-pre:bg-slate-900
          prose-pre:border
          prose-pre:border-slate-700
        ">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>

        </div>

      </div>

    </div>
  );
}