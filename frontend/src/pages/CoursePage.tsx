import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type ProblemSummary, type Lecture, getCompletedProjects, getCompletedQuizzes } from "../api";
import { PageHeader, Card, LoadingCard } from "../components";

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [problems, setProblems] = useState<ProblemSummary[] | null>(null);
  const [lectures, setLectures] = useState<Lecture[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .courseProblems(slug)
      .then(setProblems)
      .catch((e: Error) => setErr(e.message));
    api
      .courseLectures(slug)
      .then(setLectures)
      .catch(() => setLectures([])); // Ignore errors for lectures
  }, [slug]);

  if (!slug) return null;

  const courseTitle = slug === "cs50p" ? "CS50 Python" : slug === "cs50ai" ? "CS50 AI" : slug.toUpperCase();
  const courseEmoji = slug === "cs50p" ? "🐍" : slug === "cs50ai" ? "🧠" : "📚";

  const completedProjects = getCompletedProjects();
  const completedQuizzes = getCompletedQuizzes();

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      {/* Page Header */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800/40 px-4 md:px-8 py-8 md:py-10">
        <PageHeader
          title={courseTitle}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: courseTitle },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-8 py-8">
        {err && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-300">
            {err}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {lectures === null ? (
            // Loading skeleton
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} lines={2} />
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{courseEmoji}</div>
              <p className="text-slate-400">No lectures available for this course</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📖</span> Lectures
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lecture) => {
                  // Calculate lecture progress
                  const lectureProblems = problems ? problems.filter(p => p.week_label === `Week ${lecture.number}`) : [];
                  const totalProblems = lectureProblems.length;
                  const completedProbCount = lectureProblems.filter(p => completedProjects[`${slug}/${p.slug}`]).length;
                  const quizCompleted = completedQuizzes[`${slug}_${lecture.number}`] !== undefined ? 1 : 0;
                  
                  // Total tasks = totalProblems + 1 (for the quiz)
                  const totalTasks = totalProblems + 1;
                  const completedTasks = completedProbCount + quizCompleted;
                  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                  return (
                    <Link
                      key={lecture.number}
                      to={`/course/${slug}/lecture/${lecture.number}`}
                      className="group"
                    >
                      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-xl hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 p-2.5 bg-slate-800 border border-slate-700/50 rounded-xl group-hover:bg-blue-600/15 group-hover:border-blue-500/30 group-hover:text-blue-400 text-slate-400 transition-colors">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                                {lecture.title}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 font-medium">
                                Lecture {lecture.number}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar & Details */}
                        <div className="space-y-2.5 mt-4">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Tasks Completed</span>
                            <span className="text-slate-200">
                              {completedTasks} / {totalTasks} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
