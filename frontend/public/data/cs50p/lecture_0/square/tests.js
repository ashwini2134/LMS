export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to use input()." };
  }
  
  if (!normalized.includes("**2") && !normalized.includes("*")) {
    return { passed: false, message: "❌ Expected code to calculate square using ** 2 or multiplication." };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
