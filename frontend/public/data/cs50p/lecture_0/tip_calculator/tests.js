export function runTests(code) {
  // Remove comment lines completely
  const cleanCode = code
    .split("\n")
    .filter(line => !line.trim().startsWith("#"))
    .join("\n");

  // Normalize
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

  // Check float()
  if (!normalized.includes("float(")) {
    return {
      passed: false,
      message:
        "❌ Expected code to use float().",
    };
  }

  // Check multiplication operator
  if (!normalized.includes("*")) {
    return {
      passed: false,
      message:
        "❌ Expected code to use multiplication (*) for tip calculation.",
    };
  }

  // Check percentage/tip logic
  const hasTipLogic =
    normalized.includes("/100") ||
    normalized.includes("*0.");

  if (!hasTipLogic) {
    return {
      passed: false,
      message:
        "❌ Expected percentage-based tip calculation logic.",
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