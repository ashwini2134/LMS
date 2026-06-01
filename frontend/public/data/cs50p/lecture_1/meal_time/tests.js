export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defmain(")) {
    return { passed: false, message: "❌ Expected a main() function." };
  }
  if (!normalized.includes("defconvert(")) {
    return { passed: false, message: "❌ Expected a convert() function." };
  }
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected convert() to split the time on ':'." };
  }
  if (
    !normalized.includes("breakfasttime") ||
    !normalized.includes("lunchtime") ||
    !normalized.includes("dinnertime")
  ) {
    return { passed: false, message: "❌ Expected to print 'breakfast time', 'lunch time', and 'dinner time'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
