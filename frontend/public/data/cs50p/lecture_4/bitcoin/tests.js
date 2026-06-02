export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importrequests")) {
    return { passed: false, message: "❌ Expected code to import the requests module." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the count from a command-line argument (sys.argv)." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on bad/missing input." };
  }
  if (!normalized.includes(".get(")) {
    return { passed: false, message: "❌ Expected code to query the API with requests.get()." };
  }
  if (!normalized.includes(",.4f")) {
    return { passed: false, message: "❌ Expected USD formatted to 4 decimals with a thousands separator (e.g. f\"${total:,.4f}\")." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
