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
  if (!normalized.includes(".isupper(") && !normalized.includes(".islower(")) {
    return { passed: false, message: "❌ Expected code to detect uppercase letters (e.g. .isupper())." };
  }
  if (!normalized.includes('"_"') && !normalized.includes("'_'")) {
    return { passed: false, message: "❌ Expected code to insert an underscore before each capitalized word." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the snake_case result." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
