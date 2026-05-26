export function runTests(code) {
  // Strip comments to prevent keyword spoofing
  const codeWithoutComments = code.replace(/#.*$/gm, '');
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or just comments." };
  }

  if (!normalized.includes("**")) {
    return { passed: false, message: "❌ Expected code to use ** operator." };
  }

  const withoutPower = normalized.split("**").join("");
  if (!withoutPower.includes("*")) {
    return { passed: false, message: "❌ Expected code to use * operator for multiplication." };
  }

  return { passed: true, message: "✅ All test cases passed!" };
}
