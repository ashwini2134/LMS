export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  if (!normalized.includes("for") && !normalized.includes("while") && !normalized.includes(".replace(")) {
    return { passed: false, message: "? Expected code to iterate through characters or systematically replace them." };
  }

  const hasLowerVowels = ['a','e','i','o','u'].every(v => normalized.includes(v));
  const hasUpperVowels = ['A','E','I','O','U'].every(v => normalized.includes(v));
  const convertsCase = codeWithoutComments.toLowerCase().includes(".lower()") || codeWithoutComments.toLowerCase().includes(".upper()");

  if (!(hasLowerVowels && hasUpperVowels) && !(convertsCase && hasLowerVowels)) {
    return { passed: false, message: "? Expected code to handle both lowercase and uppercase vowels." };
  }

  if (!normalized.includes("notin") && !normalized.includes(".replace") && !normalized.includes("continue") && !normalized.includes("!=")) {
    return { passed: false, message: "? Expected logic to filter out or skip vowels." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
