export function runTests(code) {
  const normalized = code.replace(/\s/g, "");

  const passed =
    normalized.includes('print("Hello,World!")') ||
    normalized.includes("print('Hello,World!')");

  if (passed) {
    return {
      passed: true,
      message: "✅ All test cases passed.",
    };
  }

  return {
    passed: false,
    message: "❌ Expected print('Hello, World!')",
  };
}