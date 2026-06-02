export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("fpdf")) {
    return { passed: false, message: "❌ Expected code to use fpdf2 (from fpdf import FPDF)." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to prompt for a name with input()." };
  }
  if (!normalized.includes('"a4"') && !normalized.includes("'a4'")) {
    return { passed: false, message: "❌ Expected the PDF format to be A4." };
  }
  if (!normalized.includes("shirtificate.png")) {
    return { passed: false, message: "❌ Expected code to place the shirtificate.png image." };
  }
  if (!normalized.includes(".output(")) {
    return { passed: false, message: "❌ Expected code to write the PDF with .output()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
