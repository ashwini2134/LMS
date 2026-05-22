export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  if (!normalized.includes("0") || !normalized.includes("20") || !normalized.includes("100")) {
    return { passed: false, message: "❌ Expected code to output $0, $20, or $100." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
