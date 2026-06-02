export function runTests(code) {
  // Remove comment lines completely
  const cleanCode = code
    .split("\n")
    .filter(line => !line.trim().startsWith("#"))
    .join("\n");

  // Normalize code
  const normalized = cleanCode
    .toLowerCase()
    .replace(/\s/g, "");

  // Empty check
  if (normalized.length === 0) {
    return {
      passed: false,
      message:
        "❌ Code cannot be empty or comments only.",
    };
  }

  // Check input()
  if (!normalized.includes("input(")) {
    return {
      passed: false,
      message: "❌ Expected code to use input().",
    };
  }

  // Check replace()
  if (!normalized.includes(".replace(")) {
    return {
      passed: false,
      message:
        "❌ Expected code to use .replace() string method.",
    };
  }

  // Check replacing ... with spaces
  const hasPlaybackLogic =
    normalized.includes('replace("...","")') ||
    normalized.includes("replace('...','')") ||
    normalized.includes('replace("..."," ")') ||
    normalized.includes("replace('...',' ')");

  if (!hasPlaybackLogic) {
    return {
      passed: false,
      message:
        '❌ Expected code to replace "..." with spaces.',
    };
  }

  // Check print()
  if (!normalized.includes("print(")) {
    return {
      passed: false,
      message: "❌ Expected code to use print().",
    };
  }

  return {
    passed: true,
    message: "✅ All test cases passed!",
  };
}