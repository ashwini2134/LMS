export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importrandom")) {
    return { passed: false, message: "❌ Expected code to import the random module." };
  }
  if (!normalized.includes("defget_level(")) {
    return { passed: false, message: "❌ Expected a get_level() function." };
  }
  if (!normalized.includes("defgenerate_integer(")) {
    return { passed: false, message: "❌ Expected a generate_integer(level) function." };
  }
  if (!normalized.includes('"eee"') && !normalized.includes("'eee'")) {
    return { passed: false, message: "❌ Expected code to print 'EEE' on a wrong answer." };
  }
  if (!normalized.includes("score:")) {
    return { passed: false, message: "❌ Expected code to print 'Score: <n>'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
