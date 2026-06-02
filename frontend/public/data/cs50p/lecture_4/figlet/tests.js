export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("pyfiglet") && !normalized.includes("figlet")) {
    return { passed: false, message: "❌ Expected code to use pyfiglet's Figlet." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read command-line arguments via sys.argv." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on invalid usage." };
  }
  if (!normalized.includes("rendertext(")) {
    return { passed: false, message: "❌ Expected code to render text with figlet.renderText()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
