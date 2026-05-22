export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  
  if (!normalized.includes("%2")) {
    return { passed: false, message: "❌ Expected modulo operator (%) to be used." };
  }
  
  if (!normalized.includes('"even"') && !normalized.includes("'even'")) {
    return { passed: false, message: '❌ Expected code to print "Even".' };
  }
  
  if (!normalized.includes('"odd"') && !normalized.includes("'odd'")) {
    return { passed: false, message: '❌ Expected code to print "Odd".' };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
