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
  if (!normalized.includes("42")) {
    return { passed: false, message: "❌ Expected code to check for '42'." };
  }
  if (!normalized.includes("forty-two") || !normalized.includes("fortytwo")) {
    return { passed: false, message: "❌ Expected code to check for 'forty-two' and 'forty two'." };
  }
  if (!normalized.includes('"yes"') && !normalized.includes("'yes'")) {
    return { passed: false, message: "❌ Expected code to print 'Yes' for a correct answer." };
  }
  if (!normalized.includes('"no"') && !normalized.includes("'no'")) {
    return { passed: false, message: "❌ Expected code to print 'No' otherwise." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
