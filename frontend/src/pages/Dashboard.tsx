import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type Course, getCompletedProjects, getStreak, getTotalXp } from "../api";
import { useAuth } from "../auth";
import { Card, LoadingCard } from "../components";
import { getCourseStats, subscribeToProgressChanges, getAllProgress } from "../hooks/useProgress";
import {
  Book,
  BookOpen,
  Brain,
  Star,
  Sparkle,
  Rocket,
  GraduationCap,
  Flame,
  BarChart3,
  Gem,
  CheckCircle,
  Monitor,
  Trophy,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState({ count: 0, lastDate: null as string | null });
  const [totalXp, setTotalXp] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for progress changes
  useEffect(() => {
    const unsub = subscribeToProgressChanges(() => setRefreshKey(k => k + 1));
    return unsub;
  }, []);

  // Refresh localStorage data on mount and on progress changes
  useEffect(() => {
    setCompletedProjects(getCompletedProjects());
    setStreak(getStreak());
    setTotalXp(getTotalXp());
  }, [refreshKey]);

  // ── Compute ALL values dynamically from actual progress data ──
  const allProgress = useMemo(() => getAllProgress(), [refreshKey]);

  // Overall stats across all courses
  const overallStats = useMemo(() => {
    const lecturesCompleted = new Set<string>();
    const quizzesPassed = new Set<string>();
    const tasksCompleted = new Set<string>();
    const coursesStarted = new Set<string>();
    const coursesCompleted = new Set<string>();

    for (const [key, p] of Object.entries(allProgress)) {
      const [courseSlug] = key.split(':');
      coursesStarted.add(courseSlug);
      if (p.lectureCompleted) {
        lecturesCompleted.add(key);
      }
      if (p.quizCompleted) {
        quizzesPassed.add(key);
      }
      if (p.handsOnTaskCompleted) {
        tasksCompleted.add(key);
      }
    }

    return {
      lecturesCompleted: lecturesCompleted.size,
      quizzesPassed: quizzesPassed.size,
      tasksCompleted: tasksCompleted.size,
      coursesStarted: coursesStarted.size,
    };
  }, [allProgress]);

  const [coursesCompletedCount, setCoursesCompletedCount] = useState(0);
  const [courseStatsMap, setCourseStatsMap] = useState<Record<string, { completed: number; total: number; lecturesCompleted: number }>>({});

  useEffect(() => {
    if (!courses) return;

    const map: Record<string, { completed: number; total: number; lecturesCompleted: number }> = {};
    let completedCourses = 0;

    Promise.all(courses.map(async (course) => {
      try {
        const lectures = await api.courseLectures(course.slug);
        const lectureCount = lectures.length;
        const stats = getCourseStats(course.slug, lectureCount);
        const completed = stats.lecturesCompleted === stats.totalLectures;
        if (completed) completedCourses++;
        map[course.slug] = {
          completed: stats.lecturesCompleted,
          total: stats.totalLectures,
          lecturesCompleted: stats.lecturesCompleted,
        };
      } catch {
        map[course.slug] = { completed: 0, total: 0, lecturesCompleted: 0 };
      }
    })).then(() => {
      setCourseStatsMap(map);
      setCoursesCompletedCount(completedCourses);
    });
  }, [courses, refreshKey]);

  useEffect(() => {
    api
      .courses()
      .then(setCourses)
      .catch((e: Error) => setErr(e.message));
  }, []);

  const totalCompleted = Object.keys(completedProjects).length;
  const projectsCount = totalCompleted;

  // Compute dynamic achievements from actual progress
  const achievements = useMemo(() => [
    {
      id: "first_lecture",
      title: "First Lecture Completed",
      description: "Complete your first lecture",
      icon: <Book size={16} />,
      unlocked: overallStats.lecturesCompleted >= 1,
    },
    {
      id: "first_quiz",
      title: "First Quiz Passed",
      description: "Pass your first knowledge check",
      icon: <Brain size={16} />,
      unlocked: overallStats.quizzesPassed >= 1,
    },
    {
      id: "five_lectures",
      title: "5 Lectures Completed",
      description: "Complete 5 lectures",
      icon: <Star size={16} />,
      unlocked: overallStats.lecturesCompleted >= 5,
    },
    {
      id: "ten_lectures",
      title: "10 Lectures Completed",
      description: "Complete 10 lectures",
      icon: <Sparkle size={16} />,
      unlocked: overallStats.lecturesCompleted >= 10,
    },
    {
      id: "first_project",
      title: "First Project Submitted",
      description: "Submit your first hands-on task",
      icon: <Rocket size={16} />,
      unlocked: overallStats.tasksCompleted >= 1,
    },
    {
      id: "course_completed",
      title: "Course Completed",
      description: "Complete an entire course",
      icon: <GraduationCap size={16} />,
      unlocked: coursesCompletedCount >= 1,
    },
  ], [overallStats, coursesCompletedCount]);

  const unlockedBadgesCount = achievements.filter((b) => b.unlocked).length;

  // Overall progress = % of lectures completed across all courses
  const overallProgress = useMemo(() => {
    let completed = 0;
    let total = 0;
    for (const stats of Object.values(courseStatsMap)) {
      completed += stats.lecturesCompleted;
      total += stats.total;
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [courseStatsMap]);

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Welcome & Onboarding Header Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 px-4 md:px-8 py-8 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Learning Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Track your progress, earn achievements, and build real skills.
            </p>
          </div>

          {/* Live Stats Summary */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame size={24} className="text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">{streak.count} Day{streak.count !== 1 ? "s" : ""}</div>
                <div className="text-xs text-slate-400 mt-1">Current Streak</div>
              </div>
            </div>

            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <BarChart3 size={24} className="text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">{overallProgress}%</div>
                <div className="text-xs text-slate-400 mt-1">Overall Progress</div>
              </div>
            </div>

            <div className="bg-slate-850/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Gem size={24} className="text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-none">{totalXp}</div>
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
          {/* Left Columns: Stats Grid & Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Courses Started", value: overallStats.coursesStarted, icon: <BookOpen size={20} />, color: "blue" },
                { label: "Courses Completed", value: coursesCompletedCount, icon: <GraduationCap size={20} />, color: "green" },
                { label: "Lectures Completed", value: overallStats.lecturesCompleted, icon: <Book size={20} />, color: "purple" },
                { label: "Quizzes Passed", value: overallStats.quizzesPassed, icon: <Brain size={20} />, color: "amber" },
                { label: "Tasks Submitted", value: overallStats.tasksCompleted, icon: <CheckCircle size={20} />, color: "emerald" },
                { label: "Projects Solved", value: projectsCount, icon: <Monitor size={20} />, color: "orange" },
              ].map((stat) => {
                const colorMap: Record<string, string> = {
                  blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-300',
                  green: 'from-green-600/20 to-green-900/10 border-green-500/20 text-green-300',
                  purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/20 text-purple-300',
                  amber: 'from-amber-600/20 to-amber-900/10 border-amber-500/20 text-amber-300',
                  emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-300',
                  orange: 'from-orange-600/20 to-orange-900/10 border-orange-500/20 text-orange-300',
                };
                return (
                  <div key={stat.label} className={`rounded-2xl bg-gradient-to-br ${colorMap[stat.color]} border p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} /> Your Courses
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
                  const progress = courseStatsMap[c.slug] || { completed: 0, total: 0, lecturesCompleted: 0 };
                  const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

                  return (
                    <Link key={c.id} to={`/course/${c.slug}`} className="group block">
                      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-xl hover:shadow-blue-950/20 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div>
                          <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex-shrink-0">
                            {c.slug === "cs50p" ? <span className="text-xs font-bold">Py</span> : <Brain size={20} />}
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                            {c.title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                            {c.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-slate-200">
                              {progress.lecturesCompleted} / {progress.total} Lectures ({percent}%)
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
              <Trophy size={20} /> Achievements
              <span className="text-xs bg-slate-800 border border-slate-700/80 px-2 py-0.5 rounded-full text-slate-400 font-normal">
                {unlockedBadgesCount} / {achievements.length} Unlocked
              </span>
            </h2>

            <Card className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <div className="space-y-3.5">
                {achievements.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                      badge.unlocked
                        ? "bg-slate-850/50 border-slate-800/80 shadow-sm"
                        : "bg-slate-900/20 border-slate-900/40 opacity-40 select-none"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
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

            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full text-center text-xs font-medium text-blue-400 hover:text-blue-300 py-3 rounded-xl bg-blue-500/8 hover:bg-blue-500/15 border border-blue-500/15 hover:border-blue-500/30 transition-all duration-200"
            >
              View Leaderboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
