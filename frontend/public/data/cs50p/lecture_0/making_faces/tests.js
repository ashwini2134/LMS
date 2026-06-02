export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defconvert(")) {
    return { passed: false, message: "❌ Expected a function called convert()." };
  }
  if (!normalized.includes("defmain(")) {
    return { passed: false, message: "❌ Expected a function called main()." };
  }
  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use the .replace() string method." };
  }
  if (!normalized.includes("🙂") || !normalized.includes("🙁")) {
    return { passed: false, message: "❌ Expected code to convert :) and :( into 🙂 and 🙁." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected main() to print the converted result." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
