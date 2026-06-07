import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { api, type Course, type Lecture } from "./api";
import {
  ArrowLeft,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  Trophy,
  User,
  X,
} from "lucide-react";

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 flex-shrink-0 px-4 h-16 border-b border-slate-700/50">
      <img
        src={`${import.meta.env.BASE_URL}logo.svg`}
        alt="Fraylon Academy"
        className="h-8 w-auto object-contain"
      />
      <span className="hidden sm:block font-bold text-slate-100 text-base tracking-wide">
        Fraylon
      </span>
    </NavLink>
  );
}

const navLinkBase =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border";

const navLinkActive =
  "bg-blue-600/15 text-blue-300 border-blue-500/30 shadow-sm";

const navLinkInactive =
  "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent hover:border-slate-700/50";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

function NavItem({ to, icon, label, end, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {icon}
      </span>
      <span className="truncate flex-1 text-left">{label}</span>
    </NavLink>
  );
}

function parseLocation(pathname: string): { courseSlug: string | null; lectureNumber: number | null } {
  const parts = pathname.split("/").filter(Boolean);
  // /course/:slug or /course/:slug/lecture/:number
  if (parts[0] === "course" && parts[1]) {
    const slug = parts[1];
    const num = parts[2] === "lecture" ? Number(parts[3]) : null;
    return { courseSlug: slug, lectureNumber: Number.isFinite(num) ? num : null };
  }
  return { courseSlug: null, lectureNumber: null };
}

export default function Shell() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"courses" | null>(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [lectureCache, setLectureCache] = useState<Record<string, Lecture[]>>({});
  const [loadingLectures, setLoadingLectures] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isWorkspace = location.pathname.includes("/project/") && !location.pathname.endsWith("/project");

  const { courseSlug: activeCourseSlug } = useMemo(
    () => parseLocation(location.pathname),
    [location.pathname]
  );

  // Auto-select course when navigating to a course page
  useEffect(() => {
    if (activeCourseSlug && activeCourseSlug !== selectedCourseSlug) {
      setSelectedCourseSlug(activeCourseSlug);
      setExpandedSection(null);
    }
  }, [activeCourseSlug, selectedCourseSlug]);

  // Fetch courses on mount
  useEffect(() => {
    api.courses().then(setCourses).catch(() => {});
  }, []);

  // Fetch lectures when a course is selected
  useEffect(() => {
    if (!selectedCourseSlug) return;
    if (lectureCache[selectedCourseSlug]) return;
    setLoadingLectures(true);
    api
      .courseLectures(selectedCourseSlug)
      .then((lectures) => {
        setLectureCache((prev) => ({ ...prev, [selectedCourseSlug]: lectures }));
      })
      .catch(() => {})
      .finally(() => setLoadingLectures(false));
  }, [selectedCourseSlug, lectureCache]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleCoursesClick = useCallback(() => {
    if (selectedCourseSlug) {
      setSelectedCourseSlug(null);
      setExpandedSection("courses");
    } else {
      setExpandedSection((prev) => (prev === "courses" ? null : "courses"));
    }
  }, [selectedCourseSlug]);

  const handleCourseClick = useCallback(
    (slug: string) => {
      setSelectedCourseSlug(slug);
      setExpandedSection(null);
      closeSidebar();
      navigate(`/course/${slug}`);
    },
    [closeSidebar, navigate]
  );

  const handleBackToCourses = useCallback(() => {
    setSelectedCourseSlug(null);
    setExpandedSection("courses");
  }, []);

  const topNavItems = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard", end: true },
  ];

  const bottomNavItems = [
    { to: "/", icon: <Trophy size={18} />, label: "Achievements" },
    { to: "/", icon: <Award size={18} />, label: "Leaderboard" },
    { to: "/", icon: <User size={18} />, label: "Profile" },
  ];

  const lectures = selectedCourseSlug ? lectureCache[selectedCourseSlug] ?? [] : [];
  const selectedCourse = courses.find((c) => c.slug === selectedCourseSlug);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm z-50">
        <div className="flex h-16 items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 flex-shrink-0 md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <NavLink to="/" className="md:hidden flex items-center gap-2 flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Fraylon Academy"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold text-slate-100 text-base tracking-wide">Fraylon</span>
          </NavLink>

          <div className="flex-1" />

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-300 truncate max-w-[140px] font-medium">
                  {user.name}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 md:relative md:inset-auto
          flex-shrink-0 flex flex-col border-r border-slate-700/50
          bg-slate-900/95 backdrop-blur-sm transition-transform duration-300 ease-in-out
          z-40 w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <Logo />

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Top nav items */}
            {topNavItems.map((item) => (
              <NavItem
                key={item.to + (item.label)}
                to={item.to}
                icon={item.icon}
                label={item.label}
                end={item.end}
                onClick={closeSidebar}
              />
            ))}

            {/* Courses section */}
            <div>
              <button
                onClick={handleCoursesClick}
                className={`${navLinkBase} w-full ${
                  expandedSection === "courses" || selectedCourseSlug
                    ? navLinkActive
                    : navLinkInactive
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {selectedCourseSlug ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBackToCourses();
                      }}
                      className="hover:text-blue-200 transition-colors"
                      title="Back to courses"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : (
                    <BookOpen size={18} />
                  )}
                </span>
                <span className="truncate flex-1 text-left">
                  {selectedCourseSlug ? selectedCourse?.title ?? "Course" : "Courses"}
                </span>
                {!selectedCourseSlug && (
                  <span className="flex-shrink-0 text-slate-500 transition-transform duration-200">
                    {expandedSection === "courses" ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {/* Course lecture nav */}
              {selectedCourseSlug && (
                <div className="mt-1 ml-2 space-y-0.5 border-l border-slate-700/40 pl-2">
                  {loadingLectures ? (
                    <div className="py-3 px-3 text-xs text-slate-500 animate-pulse">
                      Loading lectures...
                    </div>
                  ) : lectures.length === 0 ? (
                    <div className="py-3 px-3 text-xs text-slate-500">
                      No lectures available
                    </div>
                  ) : (
                    lectures.map((lecture) => {
                      const lecturePath = `/course/${selectedCourseSlug}/lecture/${lecture.number}`;
                      const isActive =
                        location.pathname === lecturePath ||
                        location.pathname.startsWith(lecturePath + "/");
                      return (
                        <NavLink
                          key={lecture.number}
                          to={lecturePath}
                          onClick={closeSidebar}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600/12 text-blue-300"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                          }`}
                        >
                          <FileText
                            size={14}
                            className={
                              isActive ? "text-blue-400" : "text-slate-500"
                            }
                          />
                          <span className="truncate">{lecture.title}</span>
                        </NavLink>
                      );
                    })
                  )}
                </div>
              )}

              {/* Expanded course list */}
              {!selectedCourseSlug && expandedSection === "courses" && (
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: courses.length * 60 }}
                >
                  <div className="mt-1 ml-2 space-y-0.5 border-l border-slate-700/40 pl-2">
                    {courses.map((course) => {
                      const isActive = activeCourseSlug === course.slug;
                      return (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course.slug)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600/12 text-blue-300"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                          }`}
                        >
                          <BookOpen
                            size={14}
                            className={
                              isActive ? "text-blue-400" : "text-slate-500"
                            }
                          />
                          <span className="truncate">{course.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="my-3 border-t border-slate-700/30" />

            {/* Bottom nav items */}
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                onClick={closeSidebar}
              />
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isWorkspace ? "overflow-hidden" : "overflow-auto"}`}>
          <div className={isWorkspace ? "w-full h-full" : "max-w-7xl mx-auto"}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
