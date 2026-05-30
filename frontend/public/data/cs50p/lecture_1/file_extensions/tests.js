export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  if (!normalized.includes("image/jpeg") || !normalized.includes("application/octet-stream")) {
    return { passed: false, message: "❌ Expected code to print correct MIME types." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
