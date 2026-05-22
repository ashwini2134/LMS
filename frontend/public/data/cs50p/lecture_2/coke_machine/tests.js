export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected code to use a while loop." };
  }
  if (!normalized.includes("25") || !normalized.includes("10") || !normalized.includes("5")) {
    return { passed: false, message: "❌ Expected code to check for 25, 10, or 5 cent coins." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
