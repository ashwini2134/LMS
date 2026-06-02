export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("importinflect")) {
    return { passed: false, message: "❌ Expected code to import the inflect module." };
  }
  if (!normalized.includes("date")) {
    return { passed: false, message: "❌ Expected code to use datetime.date." };
  }
  if (!normalized.includes("number_to_words(")) {
    return { passed: false, message: "❌ Expected code to convert the number to words with inflect's number_to_words()." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on an invalid date." };
  }
  if (!normalized.includes("minutes")) {
    return { passed: false, message: "❌ Expected output ending in 'minutes'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
