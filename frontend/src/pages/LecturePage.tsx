import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { api, type Lecture, type ProblemSummary, getCompletedProjects, getCompletedQuizzes, getProjectMetadata } from "../api";
import { Card, Spinner } from "../components";

export default function LecturePage() {
  const { slug, number } = useParams<{
    slug: string;
    number: string;
  }>();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [problems, setProblems] = useState<ProblemSummary[] | null>(null);
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !number) return;

    const fetchLectureAndProblems = async () => {
      try {
        const lecturesList = await api.courseLectures(slug);
        setAllLectures(lecturesList);
        const lectureNumber = Number(number);

        const found = lecturesList.find((l) => l.number === lectureNumber);

        if (found) {
          setLecture(found);
          setErr(null);
        } else {
          setLecture(null);
          setErr("Lecture not found");
        }

        const allProblems = await api.courseProblems(slug);

        setProblems(
          allProblems.filter(
            (p) => p.week_label === `Week ${lectureNumber}`
          )
        );
      } catch (e: any) {
        setLecture(null);
        setErr(e.message);
      }
    };

    fetchLectureAndProblems();
  }, [slug, number]);

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

  if (!lecture) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-blue-500" />
          <p className="text-slate-400">Loading lecture…</p>
        </div>
      </div>
    );
  }

  const completedProjects = getCompletedProjects();
  const completedQuizzes = getCompletedQuizzes();

  const quizKey = `${slug}_${lecture.number}`;
  const quizScore = completedQuizzes[quizKey];
  const isQuizCompleted = quizScore !== undefined;

  const totalProblems = problems ? problems.length : 0;
  const completedProbCount = problems ? problems.filter(p => completedProjects[`${slug}/${p.slug}`]).length : 0;
  const projectPercent = totalProblems > 0 ? Math.round((completedProbCount / totalProblems) * 100) : 0;

  // Lecture progress calculation (Quiz = 1 task, Projects = totalProblems tasks)
  const totalTasks = totalProblems + 1;
  const completedTasks = completedProbCount + (isQuizCompleted ? 1 : 0);
  const totalPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isAllCompleted = completedTasks === totalTasks;

  // Determine next recommended task
  let nextRecommended: {
    type: "quiz" | "project";
    id: string;
    title: string;
    estimatedTime: string;
    xp: number;
    url: string;
  } | null = null;

  if (!isQuizCompleted) {
    nextRecommended = {
      type: "quiz",
      id: "quiz",
      title: `Quiz ${lecture.number}`,
      estimatedTime: "10 min",
      xp: 25,
      url: `/course/${slug}/lecture/${lecture.number}/quiz`
    };
  } else if (!isAllCompleted) {
    const nextProj = problems ? problems.find(p => !completedProjects[`${slug}/${p.slug}`]) : null;
    if (nextProj) {
      const meta = getProjectMetadata(nextProj.slug);
      nextRecommended = {
        type: "project",
        id: nextProj.slug,
        title: nextProj.title,
        estimatedTime: meta.estimatedTime,
        xp: meta.xp,
        url: `/course/${slug}/lecture/${lecture.number}/project/${nextProj.slug}`
      };
    }
  }

  const hasNextLecture = allLectures.some(l => l.number === lecture.number + 1);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      {/* Hero Section Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 px-6 py-10 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Lecture {lecture.number} notes
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {lecture.title}
            </h1>
            
            {/* Week Overall progress bar */}
            <div className="pt-2 max-w-xs space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Week Progress</span>
                <span className="text-slate-200">{completedTasks} / {totalTasks} Tasks ({totalPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-550"
                  style={{ width: `${totalPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Resume Card on Right of Hero */}
          <div className="w-full md:w-80 flex-shrink-0">
            {isAllCompleted ? (
              <div className="bg-slate-900/80 border border-slate-800 backdrop-blur p-5 rounded-2xl shadow-xl space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-green-400 flex items-center gap-1.5">
                    <span>🎉</span> Week Completed!
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Outstanding job! You have completed all assignments and quizzes for this week.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/course/${slug}/lecture/${lecture.number}/project`}
                    className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Review Solutions
                  </Link>
                  {hasNextLecture ? (
                    <Link
                      to={`/course/${slug}/lecture/${lecture.number + 1}`}
                      className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Next Week
                    </Link>
                  ) : (
                    <Link
                      to="/"
                      className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              nextRecommended && (
                <div className="bg-slate-900/80 border border-slate-800 backdrop-blur p-5 rounded-2xl shadow-xl space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                      Continue Learning
                    </span>
                    <h3 className="font-extrabold text-sm text-white line-clamp-1 leading-tight">
                      Next: {nextRecommended.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>🕒 {nextRecommended.estimatedTime}</span>
                      <span>💎 {nextRecommended.xp} XP</span>
                    </div>
                  </div>
                  <Link
                    to={nextRecommended.url}
                    className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/15"
                  >
                    <span>Resume Workspace</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Quiz + Project Cards */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📝</span> Related Assignments
            </h2>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {/* Quiz Card */}
              <Link
                to={`/course/${slug}/lecture/${lecture.number}/quiz`}
                className="group"
              >
                <Card className="p-5 h-full flex items-center justify-between gap-4 hover:shadow-lg hover:border-slate-700 hover:-translate-y-0.5 duration-300 bg-slate-900/50 border border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-300 text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                        Quiz {lecture.number}
                      </p>
                      <p className="text-[11px] text-slate-450 mt-1">
                        10 min • 25 XP
                      </p>
                    </div>
                  </div>
                  <div>
                    {isQuizCompleted ? (
                      <span className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span>✔</span> Passed
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-800 border border-slate-750 text-slate-400 font-semibold px-2.5 py-1 rounded-full">
                        Not started
                      </span>
                    )}
                  </div>
                </Card>
              </Link>

              {/* Project Card */}
              <Link
                to={`/course/${slug}/lecture/${lecture.number}/project`}
                className="group"
              >
                <Card className="p-5 h-full flex flex-col justify-between gap-4 hover:shadow-lg hover:border-slate-700 hover:-translate-y-0.5 duration-300 bg-slate-900/50 border border-slate-800 rounded-2xl">
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0 p-2.5 bg-green-600/10 border border-green-500/20 rounded-xl group-hover:bg-green-600/20 group-hover:text-green-300 text-green-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-100 group-hover:text-green-400 transition-colors">
                          Projects list
                        </p>
                        <p className="text-[11px] text-slate-455 mt-1">
                          {totalProblems} coding assignments
                        </p>
                      </div>
                    </div>
                    <div>
                      {totalProblems > 0 && completedProbCount === totalProblems ? (
                        <span className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span>✔</span> Complete
                        </span>
                      ) : totalProblems > 0 && completedProbCount > 0 ? (
                        <span className="text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold px-2.5 py-1 rounded-full">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-800 border border-slate-750 text-slate-400 font-semibold px-2.5 py-1 rounded-full">
                          Not started
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coding progress bar */}
                  {totalProblems > 0 && (
                    <div className="space-y-2 mt-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Coding Assignments</span>
                        <span>{completedProbCount} of {totalProblems} solved ({projectPercent}%)</span>
                      </div>
                      <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${projectPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            </div>
          </div>

          {/* Lecture Notes */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-200 mb-8 border-b border-slate-700 pb-4">
              Lecture Notes
            </h2>

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
                      import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

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

                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const { node, ...rest } = props as any;

                    return match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-6 border border-slate-700"
                        {...rest}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-slate-800 px-2 py-1 rounded text-green-400 border border-slate-700 text-sm"
                        {...rest}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {lecture.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}