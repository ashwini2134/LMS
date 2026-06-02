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
    const pId = String(problemId).toLowerCase();
    
    // Script-style problems where `print` is fully expected and lacks a required `return` function
    const scriptStyleProblems = [
      "indoor", "indoor_voice",
      "playback", "playback_speed",
      "deep_thought",
      "home_federal", "home_federal_savings_bank",
      "file_extensions",
      "einstein",
      "tip_calculator",
      "square",
      "sum",
      "even_odd",
      "simple_calculator",
      "hello_world"
    ];
    
    const requiresReturn = !scriptStyleProblems.includes(pId);
    
    if (_studentCode) {
      // 1) Pre-processing & Validation
      const codeWithoutComments = _studentCode.replace(/#.*$/gm, "");
      const normalized = codeWithoutComments.replace(/\s/g, "");
      const normalizedLower = normalized.toLowerCase();

      if (normalized.length === 0) {
        reply = "It looks like your editor is empty. Where do you think you should start?";
      } else {
        // 2) Problem-specific rules
        if (["indoor", "indoor_voice"].includes(pId)) {
          if (!normalizedLower.includes(".lower()")) {
            reply = "What string method converts text to lowercase?";
          } else if (normalizedLower.includes(".upper()")) {
            reply = "You are converting the text, but is it to the case requested?";
          } else if (!normalizedLower.includes("input(")) {
            reply = "How do you get text from the user in Python?";
          }
        } 
        else if (["playback", "playback_speed"].includes(pId)) {
          if (!normalizedLower.includes(".replace(")) {
            reply = "How could you transform every space character into three periods?";
          } else if (!/\.replace\(["']\s["']\s*,\s*["']\.\.\.["']\)/.test(codeWithoutComments)) {
            reply = "Are you replacing the space character with exactly three periods?";
          }
        }
        else if (["faces", "making_faces"].includes(pId)) {
          if (!/def\s+convert\s*\(/.test(codeWithoutComments)) {
            reply = "The specification asks for a specific function. What is its name?";
          } else if (!codeWithoutComments.includes("🙂") && !codeWithoutComments.includes("🙁")) {
            reply = "How can you swap the text smileys for emojis? Are you missing the emoji replacements?";
          } else if (codeWithoutComments.includes("def convert") && codeWithoutComments.includes("print(") && !codeWithoutComments.includes("return")) {
            reply = "The specification asks convert() to return a value. What should the function send back to the caller?";
          }
        }
        else if (["deep_thought"].includes(pId)) {
          if (!normalizedLower.includes("42") || !normalizedLower.includes("forty-two") || !normalizedLower.includes("fortytwo")) {
            reply = "Does your code account for variations in spelling or spacing for the number 42?";
          } else if (!codeWithoutComments.includes("==") && !/\bmatch\b/.test(codeWithoutComments) && !/\bin\b/.test(codeWithoutComments)) {
            reply = "How can you check if the user's input matches the Great Answer?";
          } else if (!normalizedLower.includes(".lower()") && !normalizedLower.includes(".strip()")) {
            reply = "What if the user types 'FORTY TWO'? How can you normalize their input?";
          }
        }
        else if (["home_federal", "home_federal_savings_bank"].includes(pId)) {
          if (!normalizedLower.includes("hello")) {
            reply = "How do you handle a greeting that starts with 'hello'?";
          } else if (!normalizedLower.includes("h") || (!normalizedLower.includes(".startswith") && !codeWithoutComments.includes("[0]"))) {
            reply = "What if the greeting starts with 'h' but isn't 'hello'?";
          } else if (!normalizedLower.includes("0") || !normalizedLower.includes("20") || !normalizedLower.includes("100")) {
            reply = "Does your code output the correct monetary penalties ($0, $20, $100)?";
          }
        }
        else if (["file_extensions"].includes(pId)) {
          if (!normalizedLower.includes(".endswith(") && !normalizedLower.includes(".split(") && !normalizedLower.includes(".rsplit(")) {
            reply = "How can you extract the suffix of the filename string?";
          } else if (!normalizedLower.includes("gif") || !normalizedLower.includes("jpeg") || !normalizedLower.includes("pdf")) {
            reply = "Have you covered all the required media types (gif, jpg, jpeg, png, pdf, txt, zip)?";
          }
        }

        // 3) Generic syntax/logic rules
        if (!reply) {
          const lines = codeWithoutComments.split("\n").map(l => l.trim());
          const missingColon = lines.some(l => (l.startsWith("def ") || l.startsWith("if ") || l.startsWith("for ") || l.startsWith("while ") || l.startsWith("elif ") || l.startsWith("else")) && !l.endsWith(":") && l.length > 0);
          
          if (_studentCode.includes("== True") || _studentCode.includes("== False")) {
            reply = "Do you need to explicitly check equality against a boolean, or does the expression already evaluate to one?";
          } else if (/return.*\n\s+(?:print|return)/.test(codeWithoutComments)) {
            reply = "Look at what happens after your return statement. Will that code ever execute?";
          } else if (missingColon) {
            reply = "Are you missing a specific punctuation mark at the end of your conditional, loop, or function definition?";
          } else if (/\bif \w+ = /.test(_studentCode)) {
            reply = "Are you assigning a value or comparing two values? Check your equals signs.";
          } else if (requiresReturn && /\bdef\s+\w+\s*\(/.test(_studentCode) && _studentCode.includes("print(") && !_studentCode.includes("return")) {
            reply = "Your function is printing a value, but does the problem expect the function to return a value instead? What happens if another function tries to use the result?";
          } else if (requiresReturn && /\bdef\s+\w+\s*\(/.test(_studentCode) && !_studentCode.includes("return")) {
            reply = "I can see you calculate the result, but what value does the function send back to the caller? Check whether a return statement is needed.";
          }
        }
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
