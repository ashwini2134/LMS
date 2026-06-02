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
 */


// ──────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────────────────────────────────────


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
];


function requiresReturn(problemSlug: string): boolean {
  return FUNCTION_PROBLEMS.some(p => problemSlug.includes(p));
}

// ──────────────────────────────────────────────────────────────────────────────
// GLOBAL RULES (Applied to all problems)
// ──────────────────────────────────────────────────────────────────────────────\n

function checkGlobalRules(analysis: CodeAnalysis, problemSlug: string, rawCode: string): HintResponse | null {
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
  const spoofKeywords = ["lower", "replace", "emojize", "figlet", "validate", "convert", "count", "randint", "requests", "dictreader", "dictwriter", "imageops", "jar", "fpdf"];
  const rawLower = rawCode.toLowerCase();
  const cleanLower = analysis.codeWithoutComments.toLowerCase();
  const hasSpoofedKeyword = spoofKeywords.some(kw => rawLower.includes(kw) && !cleanLower.includes(kw));
  
  if (hasSpoofedKeyword || (cleanLower.replace(/\s/g, "").length === 0 && analysis.hasComments)) {
    return {
      type: 'correction',
      hint: "I can see the required logic mentioned in comments, but it doesn't appear to be implemented in executable code. Can you translate those notes into actual Python?",
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
  if (requiresReturn(problemSlug) && analysis.hasFunctionDef && analysis.hasPrint && !analysis.hasReturn) {
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
// LECTURE 3: EXCEPTIONS
// ──────────────────────────────────────────────────────────────────────────────

function hintLecture3(slug: string, analysis: CodeAnalysis, _code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("fuel")) {
    if (!normalized.includes("except")) {
      return {
        type: 'guidance',
        hint: "What happens if the user enters invalid input like '5/0' or 'X/Y'? What try-except structure is required to catch these exceptions?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly uses exceptions to handle invalid fractions.",
      isCorrect: true,
    };
  }

  if (slug.includes("taqueria")) {
    if (!normalized.includes("try") || !normalized.includes("eoferror")) {
      return {
        type: 'guidance',
        hint: "How do you keep asking for menu items until the user stops (EOF)? What try-except structure catches `EOFError`?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly handles multiple orders and stops cleanly on EOF (Control-D).",
      isCorrect: true,
    };
  }

  if (slug.includes("grocery")) {
    if (!normalized.includes(".sort(") && !normalized.includes("sorted(")) {
      return {
        type: 'guidance',
        hint: "The specification requires the grocery list to be sorted alphabetically. What function or list method does Python provide for sorting collections?",
      };
    }
    if (!normalized.includes("eoferror")) {
      return {
        type: 'guidance',
        hint: "How will your program detect when the user has finished inputting items? What try-except block can catch `EOFError`?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly counts, sorts, and displays grocery list items upon EOF.",
      isCorrect: true,
    };
  }

  if (slug.includes("outdated")) {
    if (!normalized.includes("split(")) {
      return {
        type: 'guidance',
        hint: "Dates are inputted as strings like '9/8/1636' or 'September 8, 1636'. How can you split these strings to isolate the month, day, and year?",
      };
    }
    if (!normalized.includes("valueerror") && !normalized.includes("try")) {
      return {
        type: 'guidance',
        hint: "How do you handle invalid dates or month names? What exceptions do you need to try and catch?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly parses both date formats, handles errors, and pads single digits to YYYY-MM-DD.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 4: LIBRARIES
// ──────────────────────────────────────────────────────────────────────────────

function hintLecture4(slug: string, analysis: CodeAnalysis, _code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("emojize")) {
    if (!normalized.includes("importemoji") && !normalized.includes("fromemojiimport")) {
      return {
        type: 'guidance',
        hint: "How do we import third-party modules in Python? Have you installed and imported the `emoji` package?",
      };
    }
    if (!normalized.includes("emojize(")) {
      return {
        type: 'guidance',
        hint: "What function within the `emoji` package converts codes like `:thumbs_up:` into visual emojis? (hint: check `emoji.emojize`).",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly reads text, uses `emoji.emojize()` to convert it, and prints the emojized output.",
      isCorrect: true,
    };
  }

  if (slug.includes("figlet")) {
    if (!normalized.includes("pyfiglet")) {
      return {
        type: 'guidance',
        hint: "Have you imported `pyfiglet` (or the `Figlet` class) to render ASCII art fonts?",
      };
    }
    if (!normalized.includes("sys.argv")) {
      return {
        type: 'guidance',
        hint: "How does python retrieve command-line arguments? What list in the `sys` module stores these inputs?",
      };
    }
    if (!normalized.includes("sys.exit(")) {
      return {
        type: 'guidance',
        hint: "If the user inputs an invalid command-line argument or an invalid font, how do you exit the program with an error status? (hint: check `sys.exit`).",
      };
    }
    if (!normalized.includes("rendertext(")) {
      return {
        type: 'guidance',
        hint: "What method in `pyfiglet` converts a text string into the styled ASCII art output? (hint: check `figlet.renderText()`).",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly validates command-line arguments, sets the font dynamically, and renders Figlet ASCII output.",
      isCorrect: true,
    };
  }

  if (slug.includes("adieu")) {
    if (!normalized.includes("importinflect") && !normalized.includes("frominflectimport")) {
      return {
        type: 'guidance',
        hint: "To format a list of names grammatically with commas and 'and', we can use a library. What package should you import?",
      };
    }
    if (!normalized.includes("eoferror")) {
      return {
        type: 'guidance',
        hint: "How does the program know when to stop prompting the user for names? What exception is raised on Control-D, and how do you handle it?",
      };
    }
    if (!normalized.includes(".join(")) {
      return {
        type: 'guidance',
        hint: "What method in the `inflect` engine formats lists into natural-language lists? (hint: check `p.join()`).",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly prompts for names until EOF, format-joins them with `inflect`, and prints the Adieu lyrics.",
      isCorrect: true,
    };
  }

  if (slug.includes("game") || slug.includes("guessing")) {
    if (!normalized.includes("importrandom") && !normalized.includes("fromrandomimport")) {
      return {
        type: 'guidance',
        hint: "To pick a secret integer, we need random number generation. What module does Python provide for random calculations?",
      };
    }
    if (!normalized.includes("randint(") && !normalized.includes("randrange(")) {
      return {
        type: 'guidance',
        hint: "What function in the `random` module returns a random integer within a specified range?",
      };
    }
    if (!normalized.includes("while")) {
      return {
        type: 'guidance',
        hint: "The game must keep prompting the user to guess until they guess correctly. What type of loop is suitable for an unknown number of repetitions?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly prompts for levels/guesses, loops repeatedly, generates random targets, and displays Too small / Too large / Just right.",
      isCorrect: true,
    };
  }

  if (slug.includes("professor") || slug.includes("little_professor")) {
    if (!normalized.includes("defget_level(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `get_level()` function. What values should it accept, and what does it prompt the user for?",
      };
    }
    if (!normalized.includes("defgenerate_integer(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `generate_integer(level)` function. How do you generate a random 1-digit, 2-digit, or 3-digit number based on the level?",
      };
    }
    if (!normalized.includes("eee")) {
      return {
        type: 'guidance',
        hint: "What should the program print when a student inputs an incorrect answer to an addition problem?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly structures functions for level selection, integer generation, score tracking, and the 3-strike error rules.",
      isCorrect: true,
    };
  }

  if (slug.includes("bitcoin")) {
    if (!normalized.includes("importrequests") && !normalized.includes("fromrequestsimport")) {
      return {
        type: 'guidance',
        hint: "To fetch the current price of Bitcoin, we need to query an external HTTP API. What third-party library lets us send HTTP requests?",
      };
    }
    if (!normalized.includes("sys.argv")) {
      return {
        type: 'guidance',
        hint: "How does the program know the number of Bitcoins the user wants to buy? What sys list contains command-line arguments?",
      };
    }
    if (!normalized.includes(".json(")) {
      return {
        type: 'guidance',
        hint: "How do you parse the raw API text response into a structured Python dictionary? (hint: check the `.json()` method).",
      };
    }
    if (!normalized.includes(",.4f")) {
      return {
        type: 'guidance',
        hint: "The specification requires outputting the USD price formatted to 4 decimal places with a thousands separator. How do you format floats in an f-string?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly fetches JSON data from Coindesk's API, converts inputs to floats, and displays formatted Bitcoin prices.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 6: FILE I/O
// ──────────────────────────────────────────────────────────────────────────────

function hintLecture6(slug: string, analysis: CodeAnalysis, _code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("lines")) {
    if (!normalized.includes("sys.argv")) {
      return {
        type: 'guidance',
        hint: "How does the user specify which file to read? How do you access command-line arguments in Python?",
      };
    }
    if (!normalized.includes("open(")) {
      return {
        type: 'guidance',
        hint: "Before you can read lines, you must open the file. What built-in Python function opens files?",
      };
    }
    if (!normalized.includes("startswith(") && !normalized.includes(".lstrip(")) {
      return {
        type: 'guidance',
        hint: "The program should exclude comments (lines starting with `#`) and blank lines. How can you detect if a stripped or left-stripped line starts with `#`?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly opens files, filters comments and empty lines, and counts lines of executable code.",
      isCorrect: true,
    };
  }

  if (slug.includes("pizza")) {
    if (!normalized.includes("tabulate")) {
      return {
        type: 'guidance',
        hint: "To format a CSV file as a clean ASCII grid, we need to import a specific table library. What package should you use?",
      };
    }
    if (!normalized.includes("sys.argv")) {
      return {
        type: 'guidance',
        hint: "How does the program know which CSV file to read? What sys list stores command-line parameters?",
      };
    }
    if (!normalized.includes("grid")) {
      return {
        type: 'guidance',
        hint: "The specification asks the table to be formatted in a specific style called 'grid'. Have you set this argument in your `tabulate()` call?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly loads the CSV menu and outputs a beautifully formatted grid table.",
      isCorrect: true,
    };
  }

  if (slug.includes("scourgify")) {
    if (!normalized.includes("importcsv") && !normalized.includes("fromcsvimport")) {
      return {
        type: 'guidance',
        hint: "To cleanly read and write spreadsheet files, Python has a built-in module. Have you imported the `csv` module?",
      };
    }
    if (!normalized.includes("dictreader") || !normalized.includes("dictwriter")) {
      return {
        type: 'guidance',
        hint: "How can you read and write CSV files using dictionary rows where columns are keyed by headers? (hint: check `csv.DictReader` and `csv.DictWriter`).",
      };
    }
    if (!normalized.includes("split(")) {
      return {
        type: 'guidance',
        hint: "The input file combines names as 'Last, First'. How do you split a single string based on a comma separator?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly transforms names and houses into first-name-first columns using dict readers/writers.",
      isCorrect: true,
    };
  }

  if (slug.includes("shirt")) {
    if (!normalized.includes("pil") && !normalized.includes("pillow")) {
      return {
        type: 'guidance',
        hint: "To load and modify image files, we use a third-party library. What package should you import? (hint: use the `PIL` package).",
      };
    }
    if (!normalized.includes(".fit(")) {
      return {
        type: 'guidance',
        hint: "The input image must be resized and cropped to match the shirt's size. What function within `ImageOps` fits the image dynamically?",
      };
    }
    if (!normalized.includes(".paste(")) {
      return {
        type: 'guidance',
        hint: "How do you overlay the shirt PNG directly on top of the resized student photo? (hint: check the `.paste()` method on the image object).",
      };
    }
    if (!normalized.includes(".save(")) {
      return {
        type: 'guidance',
        hint: "Once you have overlaid the shirt, how do you write the final merged image back to disk?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly reads command-line images, crops/resizes them, pastes the shirt overlay, and outputs the result.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 7: REGULAR EXPRESSIONS
// ──────────────────────────────────────────────────────────────────────────────

function hintLecture7(slug: string, analysis: CodeAnalysis, _code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("numb3rs")) {
    if (!normalized.includes("defvalidate(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `validate()` function. What parameters does it accept, and what does it return?",
      };
    }
    if (!normalized.includes("importre") && !normalized.includes("fromreimport")) {
      return {
        type: 'guidance',
        hint: "To validate IP addresses using regular expressions, what module must you import?",
      };
    }
    if (!normalized.includes("re.search(") && !normalized.includes("re.match(")) {
      return {
        type: 'guidance',
        hint: "What function in the `re` module searches a string for a match against a regular expression pattern?",
      };
    }
    if (!normalized.includes("25[0-5]") && !normalized.includes("255")) {
      return {
        type: 'guidance',
        hint: "An IP address consists of 4 octets ranging from 0 to 255. How does your regular expression confirm that each octet is at most 255?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly structures validate() and uses regular expressions to enforce valid IP ranges.",
      isCorrect: true,
    };
  }

  if (slug.includes("watch")) {
    if (!normalized.includes("defparse(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `parse()` function. Have you defined it to receive the iframe string?",
      };
    }
    if (!normalized.includes("re.search(")) {
      return {
        type: 'guidance',
        hint: "How do you search for the YouTube src attribute within the HTML iframe code? What regex function helps search strings?",
      };
    }
    if (!normalized.includes("youtu.be")) {
      return {
        type: 'guidance',
        hint: "The returned URL must be simplified in the short format 'https://youtu.be/[video_id]'. How do you construct this from the extracted video ID?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly parses the iframe, extracts the video identifier using groups, and converts it to a short URL.",
      isCorrect: true,
    };
  }

  if (slug.includes("working")) {
    if (!normalized.includes("defconvert(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `convert()` function. What parameters does it accept, and what does it return?",
      };
    }
    if (!normalized.includes("valueerror")) {
      return {
        type: 'guidance',
        hint: "If the input string does not match the required format or represents an invalid time (e.g. 13:00 AM or 9:60 PM), how do you raise a `ValueError`?",
      };
    }
    if (!normalized.includes("am") || !normalized.includes("pm")) {
      return {
        type: 'guidance',
        hint: "A time string is input in 12-hour format with AM or PM. How do you parse the meridian suffix to perform 24-hour military conversion?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly validates the AM/PM inputs, raises ValueErrors for out-of-range times, and outputs zero-padded 24-hour outputs.",
      isCorrect: true,
    };
  }

  if (slug.includes("um")) {
    if (!normalized.includes("defcount(")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `count()` function. What parameter should it accept, and what integer value does it return?",
      };
    }
    if (!normalized.includes("findall(") && !normalized.includes("finditer(")) {
      return {
        type: 'guidance',
        hint: "How can you find all occurrences of a pattern in a string? What `re` functions return multiple matches? (hint: check `re.findall()`).",
      };
    }
    if (!normalized.includes("\\bum\\b")) {
      return {
        type: 'guidance',
        hint: "The program must only count 'um' as a standalone word (excluding words like 'yummy' or 'album'). What regex characters specify word boundaries? (hint: check `\\b`).",
      };
    }
    if (!normalized.includes("ignorecase")) {
      return {
        type: 'guidance',
        hint: "The search should match 'um' case-insensitively. What flag can you pass as an argument to ignore casing? (hint: check `re.IGNORECASE`).",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly scans for case-insensitive standalone occurrences of 'um' using regex word boundaries.",
      isCorrect: true,
    };
  }

  if (slug.includes("response")) {
    if (!normalized.includes("validators") && !normalized.includes("validator_collection")) {
      return {
        type: 'guidance',
        hint: "To validate the email, the specification asks you to use either `validators` or `validator_collection`. What package are you importing?",
      };
    }
    if (normalized.includes("importre") || normalized.includes("import re")) {
      return {
        type: 'correction',
        hint: "The specification explicitly forbids writing your own regular expression or using the `re` module. Please delete `import re` and use a validator package instead.",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly uses a third-party validator library to parse inputs without writing custom regex.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LECTURE 8: OBJECT-ORIENTED PROGRAMMING
// ──────────────────────────────────────────────────────────────────────────────

function hintLecture8(slug: string, analysis: CodeAnalysis, _code: string): HintResponse | null {
  const normalized = analysis.normalizedLower;

  if (slug.includes("seasons")) {
    if (!normalized.includes("date")) {
      return {
        type: 'guidance',
        hint: "To represent and subtract dates in Python, we use the `datetime` module. Have you imported `date` from `datetime`?",
      };
    }
    if (!normalized.includes("importinflect") && !normalized.includes("frominflectimport")) {
      return {
        type: 'guidance',
        hint: "To convert numbers of minutes into words (like 'five hundred twenty-five thousand, six hundred'), what library should you use?",
      };
    }
    if (!normalized.includes("sys.exit(")) {
      return {
        type: 'guidance',
        hint: "If the user enters an invalid date format (not YYYY-MM-DD), how do you exit the program cleanly? (hint: check `sys.exit`).",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly performs date subtraction, converts time deltas to minutes, and formats them into natural-language words.",
      isCorrect: true,
    };
  }

  if (slug.includes("jar")) {
    if (!normalized.includes("classjar")) {
      return {
        type: 'guidance',
        hint: "The specification requires defining a `Jar` class. Have you created it with the `class Jar:` statement?",
      };
    }
    if (!normalized.includes("def__init__(")) {
      return {
        type: 'guidance',
        hint: "How does a class initialize new objects? What special constructor method do you need to define inside `Jar`?",
      };
    }
    if (!normalized.includes("defdeposit(") || !normalized.includes("defwithdraw(")) {
      return {
        type: 'guidance',
        hint: "A jar needs deposit and withdraw methods. What signatures did you define for `deposit(self, n)` and `withdraw(self, n)`?",
      };
    }
    if (!normalized.includes("@property")) {
      return {
        type: 'guidance',
        hint: "The specification requires `capacity` and `size` to be implemented as read-only properties. What decorator tells Python a method is a property?",
      };
    }
    if (!normalized.includes("🍪")) {
      return {
        type: 'guidance',
        hint: "The special `__str__` method should represent the jar with cookie emojis. How do you return a string containing `🍪` multiplied by the number of cookies currently in the jar?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly implements the Jar class structure with properties, error raises, deposit/withdrawal methods, and string emoji output.",
      isCorrect: true,
    };
  }

  if (slug.includes("shirtificate")) {
    if (!normalized.includes("fpdf")) {
      return {
        type: 'guidance',
        hint: "To programmatically generate PDF certificates, what third-party package should you import? (hint: use the `fpdf` or `fpdf2` package).",
      };
    }
    if (!normalized.includes('"a4"') && !normalized.includes("'a4'")) {
      return {
        type: 'guidance',
        hint: "The specification states that the PDF certificate format should be A4 portrait. Have you set these parameters in your `FPDF()` constructor?",
      };
    }
    if (!normalized.includes("shirtificate.png")) {
      return {
        type: 'guidance',
        hint: "How do you place the background shirt image on the PDF document? What method in FPDF renders images? (hint: check `.image()`).",
      };
    }
    if (!normalized.includes(".output(")) {
      return {
        type: 'guidance',
        hint: "Once you have drawn the title, image, and student name, how do you save or output the final PDF document on disk?",
      };
    }
    return {
      type: 'positive',
      hint: "✅ Your solution correctly prompts for user names, uses FPDF to construct A4 portraits, draws centered text/images, and outputs the PDF.",
      isCorrect: true,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN MENTOR LOGIC
// ──────────────────────────────────────────────────────────────────────────────

export function getMentorHint(context: MentorContext): HintResponse {
  const analysis = analyzeCode(context.studentCode);
  const code = context.studentCode;
  const slug = context.problemSlug.toLowerCase();

  // 1. Apply global rules first (these catch fundamental issues)
  const globalHint = checkGlobalRules(analysis, slug, code);
  if (globalHint) return globalHint;

  // 2. Apply lecture-specific rules
  
  if (context.lectureNum === 0) {
    const hint = hintLecture0(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 1) {
    const hint = hintLecture1(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 2) {
    const hint = hintLecture2(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 3) {
    const hint = hintLecture3(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 4) {
    const hint = hintLecture4(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 6) {
    const hint = hintLecture6(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 7) {
    const hint = hintLecture7(slug, analysis, code);
    if (hint) return hint;
  } else if (context.lectureNum === 8) {
    const hint = hintLecture8(slug, analysis, code);
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
