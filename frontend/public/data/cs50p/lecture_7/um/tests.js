export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importre")) {
    return { passed: false, message: "❌ Expected code to import the re module." };
  }
  if (!normalized.includes("defcount(")) {
    return { passed: false, message: "❌ Expected a count() function." };
  }
  if (!normalized.includes("findall(") && !normalized.includes("re.search(")) {
    return { passed: false, message: "❌ Expected code to use re.findall() (or re.search())." };
  }
  if (!normalized.includes("\\bum\\b")) {
    return { passed: false, message: "❌ Expected a word-boundary pattern for 'um' (e.g. r\"\\bum\\b\")." };
  }
  if (!normalized.includes("ignorecase")) {
    return { passed: false, message: "❌ Expected the match to be case-insensitive (re.IGNORECASE)." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
