/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FRAYLON MENTOR - Problem-Aware Socratic Hints System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This system provides targeted, problem-specific Socratic hints based on:
 * - Course (cs50p, cs50ai)
 * - Lecture number
 * - Problem slug
 * - Student code analysis
 * - Conceptual requirements
 * 
 * Behavior:\n * - Detects common Python mistakes without executing code
 * - Prevents false positives with context-aware analysis
 * - Recognizes comment spoofs vs actual implementations
 * - Provides guiding questions instead of direct answers
 * - Gives positive feedback for correct solutions
 * ═══════════════════════════════════════════════════════════════════════════════
 */\n

// ──────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────────────────────────────────────\n

export interface MentorContext {
  courseSlug: string;  // 'cs50p', 'cs50ai'
  lectureNum: number;  // 0-9
  problemSlug: string; // 'indoor_voice', 'making_faces', etc.
  studentCode: string; // Raw student submission
  message: string;     // User's chat message (can be empty)
}

export interface CodeAnalysis {
  hasComments: boolean;
  codeWithoutComments: string;
  normalized: string;
  normalizedLower: string;
  hasFunctionDef: boolean;
  functionNames: string[];
  hasReturn: boolean;
  hasPrint: boolean;
  hasInput: boolean;
  hasImport: boolean;
  hasClass: boolean;
  isEmpty: boolean;
  hasTodo: boolean;
  keywords: Map<string, boolean>;
}

export interface HintResponse {
  type: 'positive' | 'correction' | 'guidance' | 'generic';
  hint: string;
  isCorrect?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// CODE ANALYSIS ENGINE
// ──────────────────────────────────────────────────────────────────────────────\n

function analyzeCode(code: string): CodeAnalysis {
  const hasComments = /#/.test(code);
  const codeWithoutComments = code.split("\n").map(line => line.replace(/#.*$/, "")).join("\n");
  const normalized = codeWithoutComments.toLowerCase().replace(/\s/g, "");
  const normalizedLower = normalized;
  
  return {
    hasComments,
    codeWithoutComments,
    normalized,
    normalizedLower,
    hasFunctionDef: /\bdef\s+\w+\s*\(/.test(codeWithoutComments),
    functionNames: [...new Set((codeWithoutComments.match(/\bdef\s+(\w+)/g) ?? []).map(m => m.replace(/\bdef\s+/, "")))],
    hasReturn: /\breturn\b/.test(codeWithoutComments),
    hasPrint: /\bprint\s*\(/.test(codeWithoutComments),
    hasInput: /\binput\s*\(/.test(codeWithoutComments),
    hasImport: /\bimport\b|\bfrom\b/.test(codeWithoutComments),
    hasClass: /\bclass\s+\w+/.test(codeWithoutComments),
    isEmpty: normalized.length === 0,
    hasTodo: /\b(TODO|FIXME|HACK|XXX|PLACEHOLDER)\b/i.test(code),
    keywords: new Map(),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// HELPER: Problem Classification
// ──────────────────────────────────────────────────────────────────────────────\n

const FUNCTION_PROBLEMS = [
  // Lecture 0
  "making_faces",
  "tip_calculator",
  // Lecture 1
  "meal_time",
  // Lecture 2
  "vanity_plates",
  // Lecture 3
  "fuel",
  "taqueria",
  "grocery",
  "outdated",
  // Lecture 4
  "emojize",
  "figlet",
  "adieu",
  "game",
  "guessing_game",
  "professor",
  "little_professor",
  "bitcoin",
  // Lecture 6
  "lines",
  "pizza",
  "scourgify",
  "shirt",
  // Lecture 7
  "numb3rs",
  "watch",
  "watch_on_youtube",
  "working",
  "working_9_to_5",
  "um",
  "response",
  // Lecture 8
  "jar",
  "cookie_jar",
  "seasons",
  "seasons_of_love",
  "shirtificate",
  "cs50_p_shirt",
  "cs50_shirtificate",
];\n

function requiresReturn(problemSlug: string): boolean {
  return FUNCTION_PROBLEMS.some(p => problemSlug.includes(p));
}

// ──────────────────────────────────────────────────────────────────────────────
// GLOBAL RULES (Applied to all problems)
// ──────────────────────────────────────────────────────────────────────────────\n

function checkGlobalRules(analysis: CodeAnalysis): HintResponse | null {
  // 1. TODO/FIXME Detection
  if (analysis.hasTodo) {
    return {
      type: 'correction',
      hint: "I can see your code has TODO or FIXME markers. These indicate incomplete work. Can you finish implementing the logic?",
    };
  }

  // 2. Empty Code
  if (analysis.isEmpty) {
    return {
      type: 'guidance',
      hint: "How would you begin approaching this problem? What input does the specification require, and what output should your code produce?",
    };
  }

  // 3. Comment Spoof Detection
  // Check if keywords only exist in comments
  const codeNormalized = analysis.codeWithoutComments.toLowerCase().replace(/\s/g, "");
  if (codeNormalized.length === 0 && analysis.hasComments) {
    return {
      type: 'correction',
      hint: "I can see ideas mentioned in comments, but it doesn't look like they're implemented in executable code. Can you translate those notes into actual Python?",
    };
  }

  // 4. Syntax Errors
  const lines = analysis.codeWithoutComments.split("\n").map(l => l.trim());
  const missingColon = lines.some(l => 
    (l.startsWith("def ") || l.startsWith("if ") || l.startsWith("for ") || l.startsWith("while ") || l.startsWith("elif ") || l.startsWith("else ")) && 
    !l.endsWith(":") && 
    l.length > 0
  );
  
  if (missingColon) {
    return {
      type: 'correction',
      hint: "Are you missing a specific punctuation mark (like a colon `:`) at the end of a function, conditional, or loop definition?",
    };
  }

  // 5. Common Mistakes
  if (analysis.codeWithoutComments.includes("== True") || analysis.codeWithoutComments.includes("== False")) {
    return {
      type: 'correction',
      hint: "Do you need to explicitly compare against `True` or `False`, or does the expression already evaluate to a boolean?",
    };
  }

  if (/\bif\s+\w+\s*=\s*/.test(analysis.codeWithoutComments)) {
    return {
      type: 'correction',
      hint: "Are you assigning a value with `=` or comparing two values with `==`? Check which one makes sense here.",
    };
  }

  // 6. Unreachable Code
  if (/return.*\n\s+(?:print|return|[a-zA-Z_])/.test(analysis.codeWithoutComments)) {
    return {
      type: 'correction',
      hint: "Look at what happens after your return statement. Will that code ever execute?",
    };
  }

  // 7. Print vs Return (Only for function problems)
  if (requiresReturn(analysis.codeWithoutComments) && analysis.hasFunctionDef && analysis.hasPrint && !analysis.hasReturn) {
    return {
      type: 'correction',
      hint: "Your function is printing a value, but the specification asks the function to **return** a value. What's the difference, and how should you modify your code?",
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 0: FUNDAMENTALS
// ──────────────────────────────────────────────────────────────────────────────\n

function hintLecture0(slug: string, analysis: CodeAnalysis, code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("indoor_voice")) {
    if (!normalized.includes(".lower(")) {
      return {
        type: 'guidance',
        hint: "What string method converts text to lowercase?",
      };
    }
    if (normalized.includes(".upper(")) {
      return {
        type: 'correction',
        hint: "I see you're converting the text's case, but is it to the case the specification requests?",
      };
    }
    if (!normalized.includes("input(")) {
      return {
        type: 'guidance',
        hint: "How do you read a line of text from the user in Python?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly uses `input()` to read text and `.lower()` to convert it to lowercase.",
      isCorrect: true,
    };
  }

  if (slug.includes("playback_speed")) {
    if (!normalized.includes(".replace(")) {
      return {
        type: 'guidance',
        hint: "How could you transform every space character into three periods?",
      };
    }
    if (!/\.replace\(["']\s["']\s*,\s*["']\.\.\.["']\)/.test(code)) {
      return {
        type: 'guidance',
        hint: "Are you replacing the space character with exactly three periods `...`?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly uses `.replace()` to convert spaces to ellipses.",
      isCorrect: true,
    };
  }

  if (slug.includes("making_faces")) {
    if (!/def\s+convert\s*\(/.test(code)) {
      return {
        type: 'guidance',
        hint: "The specification mentions a `convert()` function. Why might the problem want you to write a separate function rather than putting everything in the main code?",
      };
    }
    if (!code.includes("🙂") && !code.includes("🙁")) {
      return {
        type: 'guidance',
        hint: "How can you swap the text emoticons for emojis? What are the actual emoji characters you need?",
      };
    }
    if (code.includes("def convert") && analysis.hasPrint && !analysis.hasReturn) {
      return {
        type: 'correction',
        hint: "The specification asks the `convert()` function to **return** a transformed string. What should the function send back to the caller?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly defines a `convert()` function that returns emoji-replaced text.",
      isCorrect: true,
    };
  }

  if (slug.includes("einstein")) {
    if (!normalized.includes("300000000")) {
      return {
        type: 'guidance',
        hint: "What is the speed of light in meters per second? You'll need to store this as a constant in your code.",
      };
    }
    if (!normalized.includes("*") || !normalized.includes("input(")) {
      return {
        type: 'guidance',
        hint: "How do you calculate E = mc²? What operations do you need?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly uses the speed of light constant and applies the E=mc² formula.",
      isCorrect: true,
    };
  }

  if (slug.includes("tip_calculator")) {
    if (!normalized.includes("float(")) {
      return {
        type: 'guidance',
        hint: "Dollar amounts and percentages are decimal numbers. How do you convert text strings to floats?",
      };
    }
    if (!code.includes("def dollars_to_float") || !code.includes("def percent_to_float")) {
      return {
        type: 'guidance',
        hint: "The specification asks for two helper functions. What are they, and what should each return?",
      };
    }
    if (!normalized.includes("/100")) {
      return {
        type: 'guidance',
        hint: "When converting a percentage to a decimal, what operation do you perform?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly defines conversion functions and calculates the tip properly.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 1: CONDITIONALS
// ──────────────────────────────────────────────────────────────────────────────\n

function hintLecture1(slug: string, analysis: CodeAnalysis, code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("deep_thought")) {
    if (!normalized.includes("42")) {
      return {
        type: 'guidance',
        hint: "What is the Great Answer that the user should provide? How do you check for it?",
      };
    }
    if (!normalized.includes("forty-two") && !normalized.includes("fortytwo") && !normalized.includes("forty two")) {
      return {
        type: 'guidance',
        hint: "The specification asks to accept the answer in multiple formats. What variations of the number 42 should your code accept?",
      };
    }
    if (!code.includes("==") && !/\bmatch\b/.test(code) && !/\bin\b/.test(code)) {
      return {
        type: 'guidance',
        hint: "How can you check if the user's input matches (or contains) your expected answer?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly accepts multiple formats of the answer (42, forty-two, etc.).",
      isCorrect: true,
    };
  }

  if (slug.includes("home_federal")) {
    if (!normalized.includes("hello")) {
      return {
        type: 'guidance',
        hint: "How should your code respond to different greetings? What is the first greeting your code checks for?",
      };
    }
    if (!normalized.includes("startswith") && !code.includes("[0]")) {
      return {
        type: 'guidance',
        hint: "What if the greeting starts with 'h' but isn't exactly 'hello'? How can you check just the first character?",
      };
    }
    if (!normalized.includes("0") || !normalized.includes("20") || !normalized.includes("100")) {
      return {
        type: 'guidance',
        hint: "Are you outputting all three required bank fees ($0, $20, and $100)?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly classifies greetings and outputs the appropriate fees.",
      isCorrect: true,
    };
  }

  if (slug.includes("file_extensions")) {
    if (!normalized.includes("endswith") && !normalized.includes("split") && !normalized.includes("rsplit")) {
      return {
        type: 'guidance',
        hint: "How can you extract or identify the file extension from a filename string?",
      };
    }
    const requiredMimes = ["jpeg", "pdf", "txt", "gif", "png", "zip"];
    const hasAllMimes = requiredMimes.every(m => normalized.includes(m));
    if (!hasAllMimes) {
      return {
        type: 'guidance',
        hint: "Have you handled all the required file types (jpeg, png, gif, pdf, txt, zip)? Are you using the correct MIME types?",
      };
    }
    if (!normalized.includes("octet-stream")) {
      return {
        type: 'guidance',
        hint: "What should your program output if the file extension isn't recognized?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly maps file extensions to MIME types.",
      isCorrect: true,
    };
  }

  if (slug.includes("math_interpreter")) {
    if (!normalized.includes("split(")) {
      return {
        type: 'guidance',
        hint: "How can you break down a mathematical expression like '1 + 2' into its parts?",
      };
    }
    if (!normalized.includes("int(")) {
      return {
        type: 'guidance',
        hint: "How do you convert the operands from strings to numbers?",
      };
    }
    if (!normalized.includes("+") && !normalized.includes("-") && !normalized.includes("*") && !normalized.includes("/")) {
      return {
        type: 'guidance',
        hint: "Your code should handle the basic arithmetic operators. Which ones does it support?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly parses and evaluates arithmetic expressions.",
      isCorrect: true,
    };
  }

  if (slug.includes("meal_time")) {
    if (!code.includes("def convert")) {
      return {
        type: 'guidance',
        hint: "The specification asks for a `convert()` function. What should it take as input and return?",
      };
    }
    if (!code.includes("def main")) {
      return {
        type: 'guidance',
        hint: "The specification suggests a `main()` function. How does that help organize your code?",
      };
    }
    if (!normalized.includes("split(")) {
      return {
        type: 'guidance',
        hint: "Time is provided as a string like '7:30'. How do you split that into hours and minutes?",
      };
    }
    if (!normalized.includes("breakfast") && !normalized.includes("lunch") && !normalized.includes("dinner")) {
      return {
        type: 'guidance',
        hint: "Your code should classify times into breakfast, lunch, or dinner periods. Does it check the right times?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly converts time strings to floats and classifies meals.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 2: LOOPS
// ──────────────────────────────────────────────────────────────────────────────\n

function hintLecture2(slug: string, analysis: CodeAnalysis, code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("camel_case") || slug.includes("camelcase")) {
    if (!normalized.includes("for")) {
      return {
        type: 'guidance',
        hint: "How can you go through each character in the string one by one?",
      };
    }
    if (!normalized.includes(".isupper(") && !normalized.includes(".islower(")) {
      return {
        type: 'guidance',
        hint: "What string method lets you check if a character is uppercase or lowercase?",
      };
    }
    if (!normalized.includes("_")) {
      return {
        type: 'guidance',
        hint: "How should you represent a camelCase boundary in the output?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly loops through characters and inserts underscores at case changes.",
      isCorrect: true,
    };
  }

  if (slug.includes("coke_machine")) {
    if (!normalized.includes("while")) {
      return {
        type: 'guidance',
        hint: "The vending machine should keep accepting coins until the user pays the full amount. What loop structure does that suggest?",
      };
    }
    if (!normalized.includes("amountdue") && !normalized.includes("insert coin")) {
      return {
        type: 'guidance',
        hint: "What should your program display to show the remaining amount due?",
      };
    }
    const coinValues = ["25", "10", "5"];
    const hasCoins = coinValues.some(c => normalized.includes(c));
    if (!hasCoins) {
      return {
        type: 'guidance',
        hint: "What are the values of quarters (25¢), dimes (10¢), and nickels (5¢)?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly implements a coin-acceptance loop.",
      isCorrect: true,
    };
  }

  if (slug.includes("just_setting_up") || slug.includes("twttr")) {
    if (!normalized.includes("aeiou")) {
      return {
        type: 'guidance',
        hint: "Your code should remove vowels. How can you identify or reference all the vowels?",
      };
    }
    if (!normalized.includes("for") && !normalized.includes("replace")) {
      return {
        type: 'guidance',
        hint: "How can you go through the text and remove vowels? What approach would you use?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly removes vowels from the text.",
      isCorrect: true,
    };
  }

  if (slug.includes("nutrition_facts")) {
    if (!normalized.includes("input(")) {
      return {
        type: 'guidance',
        hint: "How do you ask the user for a fruit name?",
      };
    }
    if (!normalized.includes("calories")) {
      return {
        type: 'guidance',
        hint: "What should your output format be? How do you display the calorie count?",
      };
    }
    const caseMethods = [".title(", ".lower(", ".upper(", ".capitalize("];
    const hasCaseMethod = caseMethods.some(m => normalized.includes(m));
    if (!hasCaseMethod) {
      return {
        type: 'guidance',
        hint: "Your code should handle the fruit name regardless of capitalization. What string method can help with case-insensitive comparison?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly looks up and displays calorie information.",
      isCorrect: true,
    };
  }

  if (slug.includes("vanity_plates")) {
    if (!code.includes("def main") || !code.includes("def is_valid")) {
      return {
        type: 'guidance',
        hint: "The specification asks for two functions. What are they, and what should each do?",
      };
    }
    if (!normalized.includes("len(")) {
      return {
        type: 'guidance',
        hint: "Plates have length constraints. How do you check the length of a string?",
      };
    }
    if (!normalized.includes(".isalpha(") && !normalized.includes(".isalnum(") && !normalized.includes(".isdigit(")) {
      return {
        type: 'guidance',
        hint: "How can you verify that characters are letters, digits, or appropriate for a license plate?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly validates vanity plate format.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 3+: EXTENDED LECTURES (Framework only, can be expanded)
// ──────────────────────────────────────────────────────────────────────────────\n

function hintLecture3Plus(slug: string, analysis: CodeAnalysis, code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;
  
  // Lecture 3 - Exceptions
  if (slug.includes("fuel")) {
    if (!normalized.includes("except")) {
      return {
        type: 'guidance',
        hint: "What happens if the user enters invalid input like '5/0'? How do you handle exceptions?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly handles exceptions for invalid fractions.",
      isCorrect: true,
    };
  }

  if (slug.includes("taqueria")) {
    if (!normalized.includes("try") && !normalized.includes("while") && !normalized.includes("input")) {
      return {
        type: 'guidance',
        hint: "How do you keep asking for menu items until the user stops (EOF)?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly handles multiple orders.",
      isCorrect: true,
    };
  }

  // More can be added here for Lectures 4, 6, 7, 8
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN MENTOR LOGIC
// ──────────────────────────────────────────────────────────────────────────────\n

export function getMentorHint(context: MentorContext): HintResponse {
  const analysis = analyzeCode(context.studentCode);
  const code = context.studentCode;
  const slug = context.problemSlug.toLowerCase();

  // 1. Apply global rules first (these catch fundamental issues)
  const globalHint = checkGlobalRules(analysis);
  if (globalHint) return globalHint;

  // 2. Apply lecture-specific rules
  const normalized = analysis.normalizedLower;
  
  if (context.lectureNum === 0) {
    const hint = hintLecture0(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 1) {
    const hint = hintLecture1(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 2) {
    const hint = hintLecture2(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum >= 3) {
    const hint = hintLecture3Plus(slug, analysis, code);
    if (hint) return hint;
  }

  // 3. If no specific hint applies, check for positive feedback on apparently correct solutions
  if (analysis.hasFunctionDef || analysis.hasInput || analysis.hasImport) {
    if (context.message.toLowerCase().includes("check") || 
        context.message.toLowerCase().includes("right") ||
        context.message.toLowerCase().includes("look")) {
      return {
        type: 'positive',
        hint: "Your code structure looks solid. Walk me through what happens step-by-step when you run it. Does the output match the specification?",
        isCorrect: false,
      };
    }
  }

  // 4. Fall back to generic Socratic hints
  const genericHints = [
    "What does your code do step by step? Walk me through the logic.",
    "What is the expected output for the sample input? Does your code produce that?",
    "Have you considered edge cases — what happens with unexpected input?",
    "Try reading the problem description again. What is it specifically asking for?",
    "Can you simplify your approach? What is the minimum code needed to solve this?",
    "What Python built-in functions might help here? Check the docs for `str`, `int`, `list`, etc.",
    "Good thinking! Now verify your logic handles every constraint in the problem.",
    "What do you think is preventing your code from passing? Let's debug that together.",
  ];
  
  return {
    type: 'generic',
    hint: genericHints[Math.floor(Math.random() * genericHints.length)],
  };
}
