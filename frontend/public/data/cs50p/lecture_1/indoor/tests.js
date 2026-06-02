export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes(".lower()")) {
    return { passed: false, message: "? Expected code to use .lower() string method." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "? Expected code to use print()." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
