export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes("while")) {
    return { passed: false, message: "? Expected code to use a 'while' loop." };
  }
  
  if (!normalized.includes("25") || !normalized.includes("10") || !normalized.includes("5")) {
    return { passed: false, message: "? Expected code to check for accepted coin values: 25, 10, 5." };
  }

  if (!normalized.includes("-") && !normalized.includes("-=") && !normalized.includes("+") && !normalized.includes("+=")) {
    return { passed: false, message: "? Expected arithmetic updates to track amount due or inserted." };
  }

  const inputMatches = codeWithoutComments.match(/\binput\s*\(/g);
  if (!inputMatches || inputMatches.length === 0) {
     return { passed: false, message: "? Expected code to use input() to accept coins." };
  }
  
  if (!normalized.includes(">") && !normalized.includes("<") && !normalized.includes("==") && !normalized.includes("!=")) {
      return { passed: false, message: "? Expected conditional logic to check if amount is fully paid." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
