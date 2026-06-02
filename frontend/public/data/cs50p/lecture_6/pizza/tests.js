export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("tabulate")) {
    return { passed: false, message: "❌ Expected code to use the tabulate package." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the file name from sys.argv." };
  }
  if (!normalized.includes(".csv")) {
    return { passed: false, message: "❌ Expected code to check the file ends in '.csv'." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  if (!normalized.includes("grid")) {
    return { passed: false, message: "❌ Expected the table to use tabulate's 'grid' format." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
