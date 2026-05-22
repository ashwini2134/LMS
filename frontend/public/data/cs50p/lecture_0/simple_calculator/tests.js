export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  
  if (!normalized.includes("+") || !normalized.includes("-") || !normalized.includes("*") || !normalized.includes("/")) {
    return { passed: false, message: "❌ Expected code to handle +, -, *, and / operators." };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
