import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Course, getCompletedProjects, getStreak, getBadges, getTotalXp } from "../api";
import { useAuth } from "../auth";
import { Card, LoadingCard } from "../components";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState({ count: 0, lastDate: null as string | null });
  const [totalXp, setTotalXp] = useState(0);
  const [courseProgress, setCourseProgress] = useState<Record<string, { completed: number; total: number }>>({});

  useEffect(() => {
    // Load local storage states
    setCompletedProjects(getCompletedProjects());
    setStreak(getStreak());
    setTotalXp(getTotalXp());

    api
      .courses()
      .then(async (coursesData) => {
        setCourses(coursesData);
        
        // Calculate progress per course
        const progressMap: Record<string, { completed: number; total: number }> = {};
        const completed = getCompletedProjects();
        
        for (const course of coursesData) {
          try {
            const problems = await api.courseProblems(course.slug);
            const total = problems.length;
            const completedInCourse = problems.filter(p => completed[`${course.slug}/${p.slug}`]).length;
            progressMap[course.slug] = { completed: completedInCourse, total };
          } catch {
            progressMap[course.slug] = { completed: 0, total: 0 };
          }
        }
        setCourseProgress(progressMap);
      })
      .catch((e: Error) => setErr(e.message));
  }, []);

  const totalCompleted = Object.keys(completedProjects).length;
  const badges = getBadges(totalCompleted, streak.count);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Welcome & Onboarding Header Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 px-4 md:px-8 py-8 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              CS50 Learning Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Keep sharpening your Python and Artificial Intelligence skills. Get step-by-step guidance from Fraylon Mentor.
            </p>
          </div>
          
          {/* Streak & Stats Summary */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">
                  {streak.count} Day{streak.count !== 1 ? "s" : ""}
                </div>
                <div className="text-xs text-slate-400 mt-1">Daily Streak</div>
              </div>
            </div>

            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl">
                ✔
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">
                  {totalCompleted}
                </div>
                <div className="text-xs text-slate-400 mt-1">Solved</div>
              </div>
            </div>

            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">
                  {totalXp}
                </div>
                <div className="text-xs text-slate-400 mt-1">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
        {err && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-300">
            <p className="font-semibold text-sm">Error loading courses</p>
            <p className="text-xs mt-1 opacity-80">{err}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns: Courses & Progress */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📚</span> Your Courses
            </h2>

            {courses === null ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <LoadingCard key={i} lines={3} />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <p className="text-slate-400">No courses available at this time.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {courses.map((c) => {
                  const progress = courseProgress[c.slug] || { completed: 0, total: 0 };
                  const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
                  
                  return (
                    <Link key={c.id} to={`/course/${c.slug}`} className="group block">
                      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-xl hover:shadow-blue-950/20 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div>
                          {/* Course Emoji */}
                          <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 text-xl flex-shrink-0">
                            {c.slug === "cs50p" ? "🐍" : "🧠"}
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                            {c.title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                            {c.description}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-slate-200">
                              {progress.completed} / {progress.total} Solved ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
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
            )}
          </div>

          {/* Right Column: Achievements & Badges */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🏆</span> Achievements
              <span className="text-xs bg-slate-800 border border-slate-700/80 px-2 py-0.5 rounded-full text-slate-400 font-normal">
                {unlockedBadgesCount} / {badges.length} Unlocked
              </span>
            </h2>

            <Card className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <div className="space-y-3.5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                      badge.unlocked
                        ? "bg-slate-850/50 border-slate-800/80 shadow-sm"
                        : "bg-slate-900/20 border-slate-900/40 opacity-40 select-none"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      badge.unlocked ? "bg-amber-500/10 border border-amber-500/20" : "bg-slate-800 border border-slate-750"
                    }`}>
                      {badge.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-250 flex items-center gap-1.5">
                        {badge.title}
                        {badge.unlocked && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                            Unlocked
                          </span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-normal">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
