export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes("42") || !normalized.includes("forty-two") || !normalized.includes("fortytwo")) {
    return { passed: false, message: "? Expected checks for '42', 'forty-two', and 'forty two'." };
  }

  const hasComparison = codeWithoutComments.includes("==") || /\bmatch\b/.test(codeWithoutComments) || /\bin\b/.test(codeWithoutComments);
  if (!hasComparison) {
     return { passed: false, message: "? Expected comparison logic (==, match, in)." };
  }

  const numPrints = (codeWithoutComments.match(/\bprint\b/g) || []).length;
  if (numPrints < 2 && !codeWithoutComments.includes("def ")) {
     if (codeWithoutComments.toLowerCase().includes("yes") && !codeWithoutComments.toLowerCase().includes("no")) {
         return { passed: false, message: "? Logic error: Constant output 'Yes' without branching logic is not allowed." };
     }
  }

  return { passed: true, message: "? All test cases passed!" };
}
