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
    return { passed: false, message: "❌ Expected a convert() function." };
  }
  if (!normalized.includes("am") || !normalized.includes("pm")) {
    return { passed: false, message: "❌ Expected code to handle AM and PM." };
  }
  if (!normalized.includes("valueerror")) {
    return { passed: false, message: "❌ Expected code to raise ValueError on invalid input." };
  }
  if (!normalized.includes(":02")) {
    return { passed: false, message: "❌ Expected zero-padded hours (e.g. f\"{hour:02}\")." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
