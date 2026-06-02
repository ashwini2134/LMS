export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or just comments." };
  }

  if (!/def\s+convert\s*\(/.test(codeWithoutComments)) {
    return { passed: false, message: "❌ Expected function convert to be defined." };
  }

  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use .replace() string method." };
  }

  const hasHappy = /\.replace\(["']:\)["']\s*,\s*["']🙂["']\)/.test(codeWithoutComments) || codeWithoutComments.includes("🙂");
  const hasSad = /\.replace\(["']:\(["']\s*,\s*["']🙁["']\)/.test(codeWithoutComments) || codeWithoutComments.includes("🙁");
  
  if (!hasHappy || !hasSad) {
    return { passed: false, message: "❌ Expected code to convert :) to 🙂 and :( to 🙁." };
  }

  if (!normalized.includes("return")) {
    return { passed: false, message: "❌ Expected convert() to return a value, not just print it." };
  }

  return { passed: true, message: "✅ All test cases passed!" };
}
