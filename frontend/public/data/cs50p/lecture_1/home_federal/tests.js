export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  if (!normalized.includes("hello")) {
    return { passed: false, message: "❌ Expected code to check for a greeting starting with 'hello'." };
  }
  if (!normalized.includes("$0") || !normalized.includes("$20") || !normalized.includes("$100")) {
    return { passed: false, message: "❌ Expected code to output $0, $20, and $100." };
  }
  if (!normalized.includes("startswith(") && !normalized.includes("[0]")) {
    return { passed: false, message: "❌ Expected code to inspect the start of the greeting (e.g. .startswith())." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
