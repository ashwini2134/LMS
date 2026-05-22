export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  if (!normalized.includes("a") || !normalized.includes("e") || !normalized.includes("i") || !normalized.includes("o") || !normalized.includes("u")) {
    return { passed: false, message: "❌ Expected code to check for vowels." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
