export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  if (!normalized.includes("image/jpeg") || !normalized.includes("application/pdf")) {
    return { passed: false, message: "❌ Expected the correct media types (e.g. image/jpeg, application/pdf)." };
  }
  if (!normalized.includes("application/octet-stream")) {
    return { passed: false, message: "❌ Expected application/octet-stream as the default." };
  }
  if (!normalized.includes("endswith(") && !normalized.includes(".lower(")) {
    return { passed: false, message: "❌ Expected case-insensitive suffix checking (e.g. .endswith())." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
