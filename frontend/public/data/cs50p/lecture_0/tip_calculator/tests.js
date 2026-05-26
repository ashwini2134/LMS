export function runTests(code) {
  // Strip comments to prevent keyword spoofing
  const codeWithoutComments = code.replace(/#.*$/gm, '');
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or just comments." };
  }

  if (!normalized.includes("float(")) {
    return { passed: false, message: "❌ Expected code to use float()." };
  }

  if (!normalized.includes("*")) {
    return { passed: false, message: "❌ Expected code to use * operator for tip calculation." };
  }

  return { passed: true, message: "✅ All test cases passed!" };
}
