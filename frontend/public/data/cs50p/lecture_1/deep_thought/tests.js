export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  if (!normalized.includes("42") || !normalized.includes("forty-two") || !normalized.includes("fortytwo")) {
    return { passed: false, message: "❌ Expected checks for '42', 'forty-two', and 'forty two'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
