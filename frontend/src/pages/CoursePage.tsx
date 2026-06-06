import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, type Lecture } from "../api";

type LectureStatus = "completed" | "in-progress" | "locked";

const ACHIEVEMENTS = [
  { id: 1, icon: "★", title: "First Steps", description: "Completed your first lecture", date: "Jan 15, 2026", gradient: "from-yellow-400 to-orange-500" },
  { id: 2, icon: "♛", title: "Quiz Master", description: "Passed 2 quizzes in a row", date: "Jan 20, 2026", gradient: "from-purple-400 to-pink-500" },
  { id: 3, icon: "◆", title: "Consistent Learner", description: "7-day learning streak", date: "Feb 01, 2026", gradient: "from-red-400 to-orange-500" },
  { id: 4, icon: "●", title: "Halfway There", description: "50% course completion", date: "Feb 10, 2026", gradient: "from-blue-400 to-cyan-500" },
];

const LECTURE_STATUSES: Record<number, LectureStatus> = {
  0: "completed",
  1: "completed",
  2: "in-progress",
};

const LECTURE_DURATIONS: Record<number, string> = {
  0: "45 min", 1: "52 min", 2: "48 min", 3: "38 min",
  4: "55 min", 5: "41 min", 6: "47 min", 7: "43 min",
  8: "58 min", 9: "36 min",
};

function ProgressCircle({ percent, size = 96 }: { percent: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-700/60" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
      </svg>
      <span className="absolute text-xl font-bold text-white">{percent}%</span>
    </div>
  );
}

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const courseTitle = slug === "cs50p" ? "CS50 Python" : slug === "cs50ai" ? "CS50 AI" : slug?.toUpperCase() ?? "";
  const lectureCount = lectures?.length ?? 0;
  const completedCount = lectures?.filter((l) => LECTURE_STATUSES[l.number] === "completed").length ?? 0;
  const progressPercent = Math.round((completedCount / Math.max(lectureCount, 1)) * 100);

  useEffect(() => {
    if (!slug) return;
    api.courseLectures(slug).then(setLectures).catch((e: Error) => setErr(e.message));
  }, [slug]);

  if (!slug) return null;

  const getStatusIcon = (status: LectureStatus) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "in-progress":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center ring-2 ring-blue-500/40 flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        );
      case "locked":
        return (
          <div className="w-8 h-8 rounded-full bg-slate-700/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: LectureStatus) => {
    switch (status) {
      case "completed":
        return <span className="text-[11px] font-medium text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">Completed</span>;
      case "in-progress":
        return <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">In Progress</span>;
      case "locked":
        return <span className="text-[11px] font-medium text-slate-500 bg-slate-600/20 px-2.5 py-0.5 rounded-full border border-slate-600/30">Locked</span>;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* ── Hero Section ── */}
          <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <button onClick={() => navigate("/")} className="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</button>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">Courses</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-white font-medium">{courseTitle}</span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{courseTitle}</h1>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  Learn Python from basics to advanced with hands-on projects and quizzes.
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C6.228 6.228 2 10.692 2 16s4.228 9.772 10 9.772 10-4.692 10-9.772c0-5.308-4.228-9.747-10-9.747z" />
                    </svg>
                    {lectureCount} Lectures
                  </div>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Beginner Level
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center lg:items-end gap-4">
                <ProgressCircle percent={progressPercent} />
                <div className="space-y-2 w-full">
                  {[
                    { label: "Lectures Completed", value: `${completedCount} / ${lectureCount}` },
                    { label: "Quizzes Passed", value: "2 / 5" },
                    { label: "Projects Submitted", value: "1 / 3" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2.5 text-xs">
                      <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-400">{stat.label}</span>
                      <span className="ml-auto font-medium text-slate-200">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Lectures Section ── */}
          <div>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              Lectures
              <span className="text-xs font-normal text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-full">{lectureCount}</span>
            </h2>

            {err && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-300 text-sm">{err}</div>
            )}

            {lectures === null ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-slate-800/40 animate-pulse border border-slate-700/20" />
                ))}
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No lectures available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lectures.map((lecture) => {
                  const status = LECTURE_STATUSES[lecture.number] || "locked";
                  const isLocked = status === "locked";
                  const duration = LECTURE_DURATIONS[lecture.number] || "30 min";

                  return (
                    <button
                      key={lecture.number}
                      onClick={() => !isLocked && navigate(`/course/${slug}/lecture/${lecture.number}`)}
                      disabled={isLocked}
                      className={`w-full text-left group rounded-2xl border transition-all duration-200 ${
                        isLocked
                          ? "border-slate-700/20 bg-slate-800/20 opacity-60 cursor-not-allowed"
                          : "border-slate-700/30 bg-slate-800/40 hover:border-blue-500/30 hover:bg-slate-800/60 hover:shadow-[0_0_16px_rgba(59,130,246,0.08)] cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex flex-col items-center gap-1">
                          {getStatusIcon(status)}
                          {lecture.number < lectures.length - 1 && (
                            <div className={`w-0.5 h-6 ${status === "completed" ? "bg-green-500/30" : "bg-slate-700/30"}`} />
                          )}
                        </div>

                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                          isLocked ? "bg-slate-700/30" : "bg-blue-600/15 group-hover:bg-blue-600/25"
                        }`}>
                          <svg className={`w-5 h-5 ${isLocked ? "text-slate-500" : "text-blue-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold truncate ${isLocked ? "text-slate-500" : "text-slate-200 group-hover:text-white"} transition-colors`}>
                              {lecture.title}
                            </p>
                            <span className="text-[11px] text-slate-500 flex-shrink-0">Week {lecture.number}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isLocked ? "text-slate-600" : "text-slate-400"}`}>
                            Lecture {lecture.number + 1} ⋅ {duration}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {getStatusBadge(status)}
                          {!isLocked && (
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar – Achievements ── */}
        <aside className="w-[280px] flex-shrink-0 hidden lg:block">
          <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-5 sticky top-0">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Recent Achievement
            </h3>
            <div className="space-y-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="flex gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-slate-700/40 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-lg`}>{a.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-200 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{a.description}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-xs font-medium text-blue-400 hover:text-blue-300 py-2.5 rounded-xl bg-blue-500/8 hover:bg-blue-500/15 border border-blue-500/15 hover:border-blue-500/30 transition-all duration-200">
              View All Achievements →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
