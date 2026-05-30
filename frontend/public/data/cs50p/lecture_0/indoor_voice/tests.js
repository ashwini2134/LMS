export function runTests(code) {
  // Strip comments to prevent keyword spoofing
  const codeWithoutComments = code.replace(/#.*$/gm, '');
  const normalized = codeWithoutComments.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or just comments." };
  }

  if (!normalized.includes(".lower()")) {
    return { passed: false, message: "❌ Expected code to use .lower() string method." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
