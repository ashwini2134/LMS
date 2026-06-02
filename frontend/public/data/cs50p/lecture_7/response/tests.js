export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("validators") && !normalized.includes("validator_collection")) {
    return { passed: false, message: "❌ Expected code to use the validators (or validator-collection) package." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to prompt for an email with input()." };
  }
  if (!normalized.includes('"valid"') && !normalized.includes("'valid'")) {
    return { passed: false, message: "❌ Expected code to print 'Valid' / 'Invalid'." };
  }
  if (normalized.includes("importre") || normalized.includes("import re")) {
    return { passed: false, message: "❌ This problem forbids using the re module." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
