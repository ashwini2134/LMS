export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.replace(/\s/g, "");
  const normalizedLower = normalized.toLowerCase();

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes("for")) {
    return { passed: false, message: "? Expected code to use a 'for' loop to iterate through characters." };
  }
  if (!normalized.includes(".isupper(")) {
    return { passed: false, message: "? Expected code to detect uppercase characters using .isupper()." };
  }
  if (!normalizedLower.includes(".lower()")) {
    return { passed: false, message: "? Expected code to convert characters to lowercase." };
  }
  if (!codeWithoutComments.includes('"_"') && !codeWithoutComments.includes("'_'")) {
    return { passed: false, message: "? Expected code to insert an underscore ('_')." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
