export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes("hello")) {
     return { passed: false, message: "? Expected code to check for 'hello'." };
  }
  if (!normalized.includes("0") || !normalized.includes("20") || !normalized.includes("100")) {
    return { passed: false, message: "? Expected code to branch to , , and ." };
  }

  if (!normalized.includes(".lower()")) {
     return { passed: false, message: "? Expected use of .lower()." };
  }
  if (!normalized.includes(".startswith(")) {
     return { passed: false, message: "? Expected use of .startswith()." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
