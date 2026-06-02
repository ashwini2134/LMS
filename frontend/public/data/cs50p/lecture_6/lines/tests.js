export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the file name from sys.argv." };
  }
  if (!normalized.includes(".py")) {
    return { passed: false, message: "❌ Expected code to check the file ends in '.py'." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  if (!normalized.includes("open(")) {
    return { passed: false, message: "❌ Expected code to open the file." };
  }
  if (!normalized.includes("startswith(") && !normalized.includes(".lstrip(")) {
    return { passed: false, message: "❌ Expected code to detect comment lines (e.g. .lstrip()/.startswith('#'))." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
