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
  if (!normalized.includes("eoferror")) {
    return { passed: false, message: "❌ Expected code to read names until EOFError (control-d)." };
  }
  if (!normalized.includes(".join(")) {
    return { passed: false, message: "❌ Expected code to join the names with inflect's .join()." };
  }
  if (!normalized.includes("adieu,adieu,to")) {
    return { passed: false, message: "❌ Expected output beginning with 'Adieu, adieu, to '." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
