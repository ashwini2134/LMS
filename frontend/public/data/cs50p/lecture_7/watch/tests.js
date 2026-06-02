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
  if (!normalized.includes("defparse(")) {
    return { passed: false, message: "❌ Expected a parse() function." };
  }
  if (!normalized.includes("re.search(") && !normalized.includes("re.match(")) {
    return { passed: false, message: "❌ Expected code to use re.search()." };
  }
  if (!normalized.includes("youtu.be")) {
    return { passed: false, message: "❌ Expected code to return a youtu.be URL." };
  }
  if (!normalized.includes("none")) {
    return { passed: false, message: "❌ Expected code to return None when there's no match." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
