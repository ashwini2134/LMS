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
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected code to split the expression with .split()." };
  }
  if (!normalized.includes("int(")) {
    return { passed: false, message: "❌ Expected code to convert operands with int()." };
  }
  if (!normalized.includes(".1f")) {
    return { passed: false, message: "❌ Expected output formatted to one decimal place (e.g. f\"{result:.1f}\")." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
