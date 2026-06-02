export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("classjar")) {
    return { passed: false, message: "❌ Expected a class called Jar." };
  }
  if (!normalized.includes("def__init__(")) {
    return { passed: false, message: "❌ Expected an __init__ method." };
  }
  if (!normalized.includes("defdeposit(") || !normalized.includes("defwithdraw(")) {
    return { passed: false, message: "❌ Expected deposit() and withdraw() methods." };
  }
  if (!normalized.includes("@property")) {
    return { passed: false, message: "❌ Expected capacity and size to be @property methods." };
  }
  if (!normalized.includes("🍪")) {
    return { passed: false, message: "❌ Expected __str__ to return cookie emoji (🍪)." };
  }
  if (!normalized.includes("raisevalueerror")) {
    return { passed: false, message: "❌ Expected ValueError to be raised on invalid capacity/deposit/withdraw." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
