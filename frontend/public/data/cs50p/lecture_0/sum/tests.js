export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to use input()." };
  }
  
  if (!normalized.includes("+")) {
    return { passed: false, message: "❌ Expected addition operator (+)." };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
