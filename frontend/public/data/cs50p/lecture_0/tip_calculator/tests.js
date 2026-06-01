export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defdollars_to_float(")) {
    return { passed: false, message: "❌ Expected a function called dollars_to_float()." };
  }
  if (!normalized.includes("defpercent_to_float(")) {
    return { passed: false, message: "❌ Expected a function called percent_to_float()." };
  }
  if (!normalized.includes("float(")) {
    return { passed: false, message: "❌ Expected code to convert strings to float() values." };
  }
  if (!normalized.includes("strip(") && !normalized.includes("replace(")) {
    return { passed: false, message: "❌ Expected code to strip the '$' and '%' characters." };
  }
  if (!normalized.includes("/100")) {
    return { passed: false, message: "❌ Expected percent_to_float to divide by 100." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
