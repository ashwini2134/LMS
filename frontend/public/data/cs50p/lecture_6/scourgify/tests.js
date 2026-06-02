export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importcsv")) {
    return { passed: false, message: "❌ Expected code to use the csv module." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read two file names from sys.argv." };
  }
  if (!normalized.includes("dictreader") && !normalized.includes("dictwriter")) {
    return { passed: false, message: "❌ Expected code to use csv.DictReader / csv.DictWriter." };
  }
  if (!normalized.includes('"first"') && !normalized.includes("'first'")) {
    return { passed: false, message: "❌ Expected output columns first, last, house." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
