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
  if (!normalized.includes("calories:")) {
    return { passed: false, message: "❌ Expected code to print 'Calories: <n>'." };
  }
  if (!normalized.includes(".title(") && !normalized.includes(".lower(") && !normalized.includes(".upper(") && !normalized.includes(".capitalize(")) {
    return { passed: false, message: "❌ Expected case-insensitive handling of the fruit name." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
