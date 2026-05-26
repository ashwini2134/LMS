export function runTests(code) {
  // Strip comments to prevent keyword spoofing
  const codeWithoutComments = code.replace(/#.*$/gm, '');
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or just comments." };
  }

  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use .replace() string method." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
