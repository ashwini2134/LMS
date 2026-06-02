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
  if (!normalized.includes("defvalidate(")) {
    return { passed: false, message: "❌ Expected a validate() function." };
  }
  if (!normalized.includes("re.search(") && !normalized.includes("re.match(")) {
    return { passed: false, message: "❌ Expected code to use re.search() or re.match()." };
  }
  if (!normalized.includes("25[0-5]") && !normalized.includes("255")) {
    return { passed: false, message: "❌ Expected the pattern to cap each octet at 255." };
  }
  if (!normalized.includes("return")) {
    return { passed: false, message: "❌ Expected validate() to return True/False." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
