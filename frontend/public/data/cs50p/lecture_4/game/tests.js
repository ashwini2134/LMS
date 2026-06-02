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
  if (!normalized.includes("randint(") && !normalized.includes("randrange(")) {
    return { passed: false, message: "❌ Expected code to pick a random number (e.g. random.randint())." };
  }
  if (!normalized.includes("toosmall!")) {
    return { passed: false, message: "❌ Expected code to print 'Too small!'." };
  }
  if (!normalized.includes("toolarge!")) {
    return { passed: false, message: "❌ Expected code to print 'Too large!'." };
  }
  if (!normalized.includes("justright!")) {
    return { passed: false, message: "❌ Expected code to print 'Just right!'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
