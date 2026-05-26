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

  // Check exponent operator **
  if (!normalized.includes("**")) {
    return {
      passed: false,
      message:
        "❌ Expected code to use ** operator.",
    };
  }

  // Check multiplication
  const withoutPower = normalized
    .split("**")
    .join("");

  if (!withoutPower.includes("*")) {
    return {
      passed: false,
      message:
        "❌ Expected code to use multiplication (*).",
    };
  }

  // Check c**2 pattern
  const hasEnergyFormula =
    /c\*\*2/.test(normalized);

  if (!hasEnergyFormula) {
    return {
      passed: false,
      message:
        "❌ Expected Einstein formula using c**2.",
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