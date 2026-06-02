export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("pil") && !normalized.includes("pillow")) {
    return { passed: false, message: "❌ Expected code to import from PIL (Pillow)." };
  }
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read two file names from sys.argv." };
  }
  if (!normalized.includes(".fit(")) {
    return { passed: false, message: "❌ Expected code to resize/crop with ImageOps.fit()." };
  }
  if (!normalized.includes(".paste(")) {
    return { passed: false, message: "❌ Expected code to overlay the shirt with .paste()." };
  }
  if (!normalized.includes(".save(")) {
    return { passed: false, message: "❌ Expected code to save the result with .save()." };
  }
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
