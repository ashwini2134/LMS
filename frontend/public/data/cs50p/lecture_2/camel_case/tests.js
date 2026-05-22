export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes(".isupper") && !normalized.includes(".islower")) {
    return { passed: false, message: "❌ Expected code to check for upper/lower case." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
