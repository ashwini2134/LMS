// ─────────────────────────────────────────────────────────────────────────────
//  Static Data Layer — no backend required
//  All data comes from /public/data/ JSON files.
//  Auth & submissions are persisted in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types (public API unchanged so pages need zero edits) ─────────────────────
export type Course = { id: number; slug: string; title: string; description: string };
export type ProblemSummary = { id: number; slug: string; title: string; week_label: string; sort_order: number };
export type ProblemDetail = ProblemSummary & {
  course_slug: string;
  description: string;
  check50_slug: string;
  difficulty?: string;
  common_mistakes?: string[];
};
export type Lecture = { number: number; title: string; content: string };
export type ChatMsg = { role: string; content: string; created_at: string };

// ── localStorage helpers ──────────────────────────────────────────────────────
const TOKEN_KEY = "fa_token";
const USERS_KEY = "fa_users";
const CHAT_KEY  = "fa_chat";

export function getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t: string)       { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken()              { localStorage.removeItem(TOKEN_KEY); }

type StoredUser = { id: number; name: string; email: string; passwordHash: string };

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]"); } catch { return []; }
}
function saveUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

// ── Simple token: base64-encoded JSON (no crypto needed for demo) ─────────────
function makeToken(user: Omit<StoredUser, "passwordHash">): string {
  return btoa(JSON.stringify({ id: user.id, email: user.email, name: user.name, exp: Date.now() + 86_400_000 * 30 }));
}
function parseToken(t: string): { id: number; email: string; name: string } | null {
  try {
    const p = JSON.parse(atob(t));
    if (p.exp < Date.now()) { clearToken(); return null; }
    return p;
  } catch { return null; }
}

// ── Chat storage ─────────────────────────────────────────────────────────────
function getChatHistory(problemId: number | string): ChatMsg[] {
  try {
    const all: Record<string, ChatMsg[]> = JSON.parse(localStorage.getItem(CHAT_KEY) ?? "{}");
    return all[String(problemId)] ?? [];
  } catch { return []; }
}
function saveChatHistory(problemId: number | string, msgs: ChatMsg[]) {
  try {
    const all: Record<string, ChatMsg[]> = JSON.parse(localStorage.getItem(CHAT_KEY) ?? "{}");
    all[String(problemId)] = msgs;
    localStorage.setItem(CHAT_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

// ── Course index (loaded once) ────────────────────────────────────────────────
type RawCourse = { slug: string; title: string; description: string };
type RawProblem = {
  id: string; title: string; description: string;
  check50_slug: string; difficulty?: string; common_mistakes?: string[];
};

let _courseIndex: RawCourse[] | null = null;
let _problemCounter = 1;
// Maps slug → array of ProblemSummary (populated lazily)
const _problemCache: Map<string, ProblemSummary[]>   = new Map();
const _problemDetailCache: Map<number, ProblemDetail> = new Map();
// Maps "slug/lectureNum" → Lecture
const _lectureCache: Map<string, Lecture[]> = new Map();

const BASE = import.meta.env.BASE_URL ?? "/";

async function fetchJson<T>(path: string): Promise<T> {
  // Normalise path so we never get double-slashes
  const url = BASE.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json() as Promise<T>;
}

async function loadCourseIndex(): Promise<RawCourse[]> {
  if (_courseIndex) return _courseIndex;
  _courseIndex = await fetchJson<RawCourse[]>("data/courses.json");
  return _courseIndex;
}

async function loadProblems(courseSlug: string): Promise<ProblemSummary[]> {
  if (_problemCache.has(courseSlug)) return _problemCache.get(courseSlug)!;

  const index = await loadCourseIndex();
  const course = index.find((c) => c.slug === courseSlug);
  if (!course) return [];

  // Fetch the per-course lecture manifest
  let lectureManifest: { number: number; label: string }[] = [];
  try {
    lectureManifest = await fetchJson<{ number: number; label: string }[]>(
      `data/${courseSlug}/lectures.json`
    );
  } catch { /* no manifest — fall back */ }

  const summaries: ProblemSummary[] = [];

  for (const lm of lectureManifest) {
    let rawProblems: RawProblem[] = [];
    try {
      rawProblems = await fetchJson<RawProblem[]>(
        `data/${courseSlug}/lecture_${lm.number}/problems.json`
      );
    } catch { /* lecture has no problems */ }

    let sortOrder = 0;
    for (const rp of rawProblems) {
      const globalId = _problemCounter++;
      const summary: ProblemSummary = {
        id: globalId,
        slug: rp.id,
        title: rp.title,
        week_label: lm.label,
        sort_order: sortOrder++,
      };
      summaries.push(summary);

      const detail: ProblemDetail = {
        ...summary,
        course_slug: courseSlug,
        description: rp.description,
        check50_slug: rp.check50_slug,
        difficulty: rp.difficulty,
        common_mistakes: rp.common_mistakes,
      };
      _problemDetailCache.set(globalId, detail);
    }
  }

  _problemCache.set(courseSlug, summaries);
  return summaries;
}

async function loadLectures(courseSlug: string): Promise<Lecture[]> {
  if (_lectureCache.has(courseSlug)) return _lectureCache.get(courseSlug)!;

  let lectureManifest: { number: number; label: string; title: string }[] = [];
  try {
    lectureManifest = await fetchJson<{ number: number; label: string; title: string }[]>(
      `data/${courseSlug}/lectures.json`
    );
  } catch { return []; }

  const lectures: Lecture[] = [];
  for (const lm of lectureManifest) {
    let content = "";
    try {
      const url = BASE.replace(/\/$/, "") + `/data/${courseSlug}/lecture_${lm.number}/notes.md`;
      const res = await fetch(url);
      if (res.ok) content = await res.text();
    } catch { /* no notes */ }
    lectures.push({ number: lm.number, title: lm.title, content });
  }

  _lectureCache.set(courseSlug, lectures);
  return lectures;
}

// ── Public API (same shape as the old api object) ─────────────────────────────
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  register: async (email: string, password: string, name: string): Promise<{ access_token: string }> => {
    const users = getUsers();
    if (users.some((u) => u.email === email)) throw new Error("Email already in use");
    const id = Date.now();
    const newUser: StoredUser = { id, name, email, passwordHash: btoa(password) };
    saveUsers([...users, newUser]);
    const token = makeToken(newUser);
    return { access_token: token };
  },

  login: async (email: string, password: string): Promise<{ access_token: string }> => {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.passwordHash === btoa(password));
    if (!user) throw new Error("Invalid email or password");
    return { access_token: makeToken(user) };
  },

  me: async (): Promise<{ id: number; email: string; name: string }> => {
    const t = getToken();
    if (!t) throw new Error("Not authenticated");
    const p = parseToken(t);
    if (!p) throw new Error("Session expired");
    return p;
  },

  // ── Courses ───────────────────────────────────────────────────────────────
  courses: async (): Promise<Course[]> => {
    const index = await loadCourseIndex();
    return index.map((c, i) => ({ id: i + 1, slug: c.slug, title: c.title, description: c.description }));
  },

  courseProblems: (slug: string) => loadProblems(slug),

  courseLectures: (slug: string) => loadLectures(slug),

  // ── Problem detail ────────────────────────────────────────────────────────
  problem: async (id: number): Promise<ProblemDetail> => {
    // Ensure the course problems are loaded (populates _problemDetailCache)
    const index = await loadCourseIndex();
    for (const c of index) {
      if (!_problemCache.has(c.slug)) await loadProblems(c.slug);
    }
    const detail = _problemDetailCache.get(id);
    if (!detail) throw new Error("Problem not found");
    return detail;
  },

  // ── Mentor chat (localStorage-based Socratic hints, no LLM call) ──────────
  chat: async (problemId: number | string, message: string, _studentCode: string | null): Promise<{ reply: string }> => {
    await new Promise((r) => setTimeout(r, 600));
    
    let reply = "";
    
    // Simple logic to detect common Python mistakes and suggest targeted questions
    if (_studentCode) {
      if (_studentCode.includes("== True") || _studentCode.includes("== False")) {
        reply = "I noticed you're using `== True` in your condition. In Python, boolean expressions already evaluate to True or False. Can you simplify the condition and see if it's still correct?";
      } else if (_studentCode.includes("def convert(text):") && _studentCode.includes("print(")) {
        reply = "The convert function currently prints the transformed text. The specification asks the function to return a value. How could you modify the function so the caller decides when to print?";
      } else if (_studentCode.includes("print(") && !_studentCode.includes("return")) {
        reply = "Your function is printing a value, but does the problem expect the function to return a value instead? What happens if another function tries to use the result?";
      } else if (/\bdef\s+\w+\s*\(/.test(_studentCode) && !_studentCode.includes("return")) {
        reply = "I can see you calculate the result, but what value does the function send back to the caller? Check whether a return statement is needed.";
      } else if (/\bdef \w+\(.*\)(?!:)/.test(_studentCode)) {
        reply = "Take a close look at your function definition. Are you missing a colon at the end?";
      } else if (/\bif \w+ = /.test(_studentCode)) {
        reply = "I see a single equals sign (`=`) inside an `if` statement. What's the difference between assignment and comparison in Python?";
      }
    }

    if (!reply) {
      const hints = [
        "What does your code do step by step? Walk me through it.",
        "What is the expected output for the sample input? Does your code produce that?",
        "Have you checked the edge cases — what happens with unexpected input?",
        "Try reading the problem description again. What is it specifically asking for?",
        "Can you simplify your approach? What is the minimum code needed to pass?",
        "What Python built-ins might help here? Check the docs for `str`, `int`, `list`.",
        "Good thinking! Now verify your logic handles every constraint in the problem.",
      ];
      reply = hints[Math.floor(Math.random() * hints.length)];
    }

    const existing = getChatHistory(problemId);
    const userMsg: ChatMsg  = { role: "user",   content: message, created_at: new Date().toISOString() };
    const asstMsg: ChatMsg  = { role: "assistant", content: reply, created_at: new Date().toISOString() };
    saveChatHistory(problemId, [...existing, userMsg, asstMsg]);

    return { reply };
  },

  chatHistory: async (problemId: number | string): Promise<ChatMsg[]> => {
    return getChatHistory(problemId);
  },
};
