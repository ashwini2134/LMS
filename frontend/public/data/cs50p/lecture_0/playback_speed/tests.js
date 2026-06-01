export function runTests(code) {
  // Remove comments
  const cleanCode = code.replace(/#.*$/gm, "");

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

  // Check replacing spaces with ...
  const hasPlaybackLogic =
    normalized.includes('replace(" ","...")') ||
    normalized.includes("replace(' ','...')");

  if (!hasPlaybackLogic) {
    return {
      passed: false,
      message:
        '❌ Expected code to replace spaces with "...".',
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