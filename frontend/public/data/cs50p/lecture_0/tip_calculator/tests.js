export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes("float(")) {
    return { passed: false, message: "❌ Expected code to use float()." };
  }
  if (!normalized.includes("strip(")) {
    return { passed: false, message: "❌ Expected code to use string strip()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
