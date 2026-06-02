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
  if (!normalized.includes("int(")) {
    return { passed: false, message: "❌ Expected code to convert the input to an int with int()." };
  }
  if (!normalized.includes("300000000")) {
    return { passed: false, message: "❌ Expected code to use the speed of light, 300000000." };
  }
  // Accept either m * c * c or c ** 2 forms of the formula.
  if (!normalized.includes("*")) {
    return { passed: false, message: "❌ Expected code to compute E = m * c² using multiplication." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
