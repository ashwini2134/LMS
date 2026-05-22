export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes("300000000**2") && !normalized.includes("90000000000000000") && !normalized.includes("300000000*300000000")) {
    return { passed: false, message: "❌ Expected Einstein formula E = m * c^2 (using 300000000 for c)." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
