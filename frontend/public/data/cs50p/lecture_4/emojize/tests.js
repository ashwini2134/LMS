export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importemoji")) {
    return { passed: false, message: "❌ Expected code to import the emoji module." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  if (!normalized.includes("emojize(")) {
    return { passed: false, message: "❌ Expected code to call emoji.emojize()." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the emojized text." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
