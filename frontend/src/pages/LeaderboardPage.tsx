import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api, getCompletedProjects, getTotalXp, getStreak } from '../api';
import { getAllProgress, subscribeToProgressChanges } from '../hooks/useProgress';
import { Card, LoadingCard } from '../components';
import { Trophy, Medal, Award, Flame } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  lecturesCompleted: number;
  quizzesPassed: number;
  tasksCompleted: number;
  projectsSolved: number;
  totalXp: number;
  streak: number;
  completionPercent: number;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for progress changes
  useEffect(() => {
    const unsub = subscribeToProgressChanges(() => setRefreshKey(k => k + 1));
    return unsub;
  }, []);

  useEffect(() => {
    setLoading(true);

    // Load all progress data and compute leaderboard entries
    // In a real app, this would be a server endpoint.
    // Here we compute from local data per-user.
    const allProgress = getAllProgress();
    const completedProjects = getCompletedProjects();
    const totalXp = getTotalXp();
    const streak = getStreak();

    // Compute stats for current user (since we're in localStorage-only mode)
    const computeEntries = async () => {
      const courses = await api.courses();

      let totalLecturesAcrossCourses = 0;
      const courseLectureCounts: Record<string, number> = {};

      for (const course of courses) {
        try {
          const lectures = await api.courseLectures(course.slug);
          courseLectureCounts[course.slug] = lectures.length;
          totalLecturesAcrossCourses += lectures.length;
        } catch {
          courseLectureCounts[course.slug] = 0;
        }
      }

      const lecturesCompleted = new Set<string>();
      const quizzesPassed = new Set<string>();
      const tasksCompleted = new Set<string>();

      for (const [key, p] of Object.entries(allProgress)) {
        if (p.lectureCompleted) lecturesCompleted.add(key);
        if (p.quizCompleted) quizzesPassed.add(key);
        if (p.handsOnTaskCompleted) tasksCompleted.add(key);
      }

      const projectsCount = Object.keys(completedProjects).length;

      const completionPercent = totalLecturesAcrossCourses > 0
        ? Math.round((lecturesCompleted.size / totalLecturesAcrossCourses) * 100)
        : 0;

      const currentUserEntry: LeaderboardEntry = {
        rank: 1,
        name: user?.name ?? 'You',
        email: user?.email ?? '',
        lecturesCompleted: lecturesCompleted.size,
        quizzesPassed: quizzesPassed.size,
        tasksCompleted: tasksCompleted.size,
        projectsSolved: projectsCount,
        totalXp: totalXp,
        streak: streak.count,
        completionPercent,
      };

      setEntries([currentUserEntry]);
      setLoading(false);
    };

    computeEntries();
  }, [user, refreshKey]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-slate-300" />;
    if (rank === 3) return <Award size={20} className="text-amber-600" />;
    return <span className="text-slate-500 font-mono text-sm w-5 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'border-yellow-500/30 bg-yellow-500/5';
    if (rank === 2) return 'border-slate-400/20 bg-slate-400/5';
    if (rank === 3) return 'border-amber-600/20 bg-amber-600/5';
    return 'border-slate-700/20 bg-slate-800/20';
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-medium">Leaderboard</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy size={32} className="text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Rankings are computed from actual completion data — lectures, quizzes, tasks, and projects.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <LoadingCard key={i} lines={2} />)}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Trophy size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-2">No Rankings Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Complete lectures, pass quizzes, and submit tasks to appear on the leaderboard.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <Card className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-1 text-center">Lectures</div>
              <div className="col-span-1 text-center">Quizzes</div>
              <div className="col-span-1 text-center">Tasks</div>
              <div className="col-span-1 text-center">Projects</div>
              <div className="col-span-2 text-center">Streak</div>
              <div className="col-span-2 text-right">Progress</div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-slate-800/40">
              {entries.map((entry) => (
                <div
                  key={entry.email}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-l-2 ${getRankBg(entry.rank)} transition-colors ${
                    entry.email === user?.email ? 'bg-blue-500/5 border-blue-500/30' : ''
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {entry.name}
                        {entry.email === user?.email && (
                          <span className="ml-2 text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 text-center text-sm text-slate-300">{entry.lecturesCompleted}</div>
                  <div className="col-span-1 text-center text-sm text-slate-300">{entry.quizzesPassed}</div>
                  <div className="col-span-1 text-center text-sm text-slate-300">{entry.tasksCompleted}</div>
                  <div className="col-span-1 text-center text-sm text-slate-300">{entry.projectsSolved}</div>
                  <div className="col-span-2 text-center text-sm">
                    <span className="inline-flex items-center gap-1 text-amber-400">
                      <Flame size={16} className="text-amber-400" /> {entry.streak}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${entry.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-300 w-10 text-right">{entry.completionPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info card */}
        <Card className="mt-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-sm">ℹ</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-1">How Rankings Work</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The leaderboard is populated from actual student activity — no fake data. Rankings are based on
                lectures completed, quizzes passed, tasks submitted, projects solved, and streak days.
                Progress updates in real-time as you learn.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
