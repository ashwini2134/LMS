export interface DebugStep {
  lineIndex: number;
  lineText: string;
  variables: Record<string, string>;
  outputs: string[];
  error?: string;
}

// Helper to translate basic Python expressions to JavaScript
function translateExprToJS(expr: string): string {
  let js = expr.trim();
  
  // Replace string methods
  js = js.replace(/\.lower\(\)/g, ".toLowerCase()");
  js = js.replace(/\.upper\(\)/g, ".toUpperCase()");
  js = js.replace(/\.strip\(\)/g, ".trim()");
  js = js.replace(/\.startswith\(/g, ".startsWith(");
  js = js.replace(/\.endswith\(/g, ".endsWith(");
  js = js.replace(/\.title\(\)/g, ".replace(/\\b\\w/g, c => c.toUpperCase())");
  js = js.replace(/\.capitalize\(\)/g, ".replace(/^\\w/, c => c.toUpperCase())");
  
  // Replace .replace() with .replaceAll()
  // Python: replace(old, new) -> JS: replaceAll(old, new)
  js = js.replace(/\.replace\(/g, ".replaceAll(");

  // Replace type conversions
  js = js.replace(/\bint\(/g, "parseInt(");
  js = js.replace(/\bfloat\(/g, "parseFloat(");
  js = js.replace(/\bstr\(/g, "String(");
  js = js.replace(/\blen\(/g, "String("); // Mock len as String length check later
  
  // Replace Python constants and booleans
  js = js.replace(/\bTrue\b/g, "true");
  js = js.replace(/\bFalse\b/g, "false");
  js = js.replace(/\bNone\b/g, "null");

  // Replace logical operators
  // Avoid replacing inside strings by simple replacements for basic cases
  js = js.replace(/\band\b/g, "&&");
  js = js.replace(/\bor\b/g, "||");
  js = js.replace(/\bnot\b/g, "!");

  return js;
}

export function runPythonMock(code: string, rawInput: string): DebugStep[] {
  const steps: DebugStep[] = [];
  const lines = code.split("\n");
  const inputs = rawInput.split("\n");
  let inputIdx = 0;

  const vars: Record<string, any> = {};
  const funcs: Record<string, Function> = {};
  const outputs: string[] = [];

  // Expose print helper
  const printHelper = (...args: any[]) => {
    outputs.push(args.join(" "));
  };

  // Expose input helper
  const inputHelper = (_prompt?: string) => {
    const val = inputs[inputIdx++];
    return val !== undefined ? val : "";
  };

  // Context builder for evaluation
  const getContext = () => {
    return {
      ...vars,
      ...funcs,
      input: inputHelper,
      print: printHelper,
      parseInt: (val: any) => parseInt(String(val).replace(/\D/g, "")) || 0, // safe digit parser
      parseFloat: (val: any) => {
        const num = parseFloat(String(val).replace(/[^\d.-]/g, ""));
        return isNaN(num) ? 0 : num;
      },
      len: (val: any) => {
        if (typeof val === "string" || Array.isArray(val)) return val.length;
        return 0;
      }
    };
  };

  // Safe evaluation function
  const evalExpr = (expr: string) => {
    const context = getContext();
    const keys = Object.keys(context);
    const vals = Object.values(context);
    const jsExpr = translateExprToJS(expr);
    try {
      const fn = new Function(...keys, `return ${jsExpr};`);
      return fn(...vals);
    } catch (e: any) {
      console.warn("Eval error for:", jsExpr, e);
      return undefined;
    }
  };

  // First pass: scan and define helper functions
  let insideFunction = false;
  let currentFunctionName = "";
  let currentFunctionParams: string[] = [];
  let currentFunctionBody: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("def ")) {
      insideFunction = true;
      const match = trimmed.match(/def\s+(\w+)\s*\(([^)]*)\)/);
      if (match) {
        currentFunctionName = match[1];
        currentFunctionParams = match[2].split(",").map(p => p.trim()).filter(Boolean);
        currentFunctionBody = [];
      }
      continue;
    }

    if (insideFunction) {
      // Check if line is indented or empty
      const isIndented = line.startsWith("    ") || line.startsWith("\t") || trimmed.length === 0;
      if (isIndented) {
        currentFunctionBody.push(line);
      } else {
        // Function ended, compile it
        compileFunction(currentFunctionName, currentFunctionParams, currentFunctionBody, funcs);
        insideFunction = false;
      }
    }
  }
  // Catch function if it ends at EOF
  if (insideFunction) {
    compileFunction(currentFunctionName, currentFunctionParams, currentFunctionBody, funcs);
  }

  // Second pass: step-by-step execution tracer
  let i = 0;

  // Track execution block indentation for conditionals
  let conditionalStack: { satisfied: boolean; indentLevel: number }[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const indentLevel = line.length - line.trimStart().length;

    // 1. Skip function definitions during main execution
    if (trimmed.startsWith("def ")) {
      i++;
      while (i < lines.length && (lines[i].startsWith("    ") || lines[i].startsWith("\t") || lines[i].trim().length === 0)) {
        i++;
      }
      continue;
    }

    // 2. Skip empty lines or comment-only lines
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    // Check conditional stack (skip lines if we are inside an unsatisfied if/elif/else block)
    if (conditionalStack.length > 0) {
      const currentBlock = conditionalStack[conditionalStack.length - 1];
      if (indentLevel > currentBlock.indentLevel) {
        if (!currentBlock.satisfied) {
          i++;
          continue;
        }
      } else {
        // We popped out of the conditional block
        conditionalStack = conditionalStack.filter(b => indentLevel > b.indentLevel);
      }
    }

    // Handle If statement
    if (trimmed.startsWith("if ") && trimmed.endsWith(":")) {
      const condExpr = trimmed.substring(3, trimmed.length - 1);
      const isSatisfied = !!evalExpr(condExpr);
      conditionalStack.push({ satisfied: isSatisfied, indentLevel });
      steps.push(createStep(i, line, vars, outputs));
      i++;
      continue;
    }

    // Handle Elif statement
    if (trimmed.startsWith("elif ") && trimmed.endsWith(":")) {
      const condExpr = trimmed.substring(5, trimmed.length - 1);
      // Only execute elif if no previous blocks in this chain were satisfied
      const parentBlock = conditionalStack[conditionalStack.length - 1];
      const isSatisfied = !parentBlock?.satisfied && !!evalExpr(condExpr);
      if (parentBlock) {
        parentBlock.satisfied = parentBlock.satisfied || isSatisfied;
      }
      conditionalStack.push({ satisfied: isSatisfied, indentLevel });
      steps.push(createStep(i, line, vars, outputs));
      i++;
      continue;
    }

    // Handle Else statement
    if (trimmed.startsWith("else:") || trimmed.startsWith("else :")) {
      const parentBlock = conditionalStack[conditionalStack.length - 1];
      const isSatisfied = !parentBlock?.satisfied;
      if (parentBlock) {
        parentBlock.satisfied = true; // mark chain as satisfied
      }
      conditionalStack.push({ satisfied: isSatisfied, indentLevel });
      steps.push(createStep(i, line, vars, outputs));
      i++;
      continue;
    }

    // Handle print
    if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
      const printInner = trimmed.substring(6, trimmed.length - 1);
      
      // If it contains multiple arguments separated by commas (not inside quotes)
      // For simplicity, evaluate it inside a JS array block
      let val;
      if (printInner.startsWith("f'") || printInner.startsWith("f\"") || printInner.startsWith("f`")) {
        // f-string parsing: f"hello {name}"
        let content = printInner.slice(2, -1);
        val = content.replace(/\{([^}]+)\}/g, (_, innerExpr) => {
          const res = evalExpr(innerExpr);
          return res !== undefined ? String(res) : "";
        });
      } else {
        // Evaluate multiple comma parameters as an array
        val = evalExpr(`[${printInner}]`);
        if (Array.isArray(val)) {
          val = val.join(" ");
        }
      }

      if (val !== undefined) {
        outputs.push(String(val));
      }

      steps.push(createStep(i, line, vars, outputs));
      i++;
      continue;
    }

    // Handle assignment: var = expr
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const expr = assignMatch[2];
      const val = evalExpr(expr);
      if (val !== undefined) {
        vars[varName] = val;
      }
      steps.push(createStep(i, line, vars, outputs));
      i++;
      continue;
    }

    // Generic fallback for any other statement
    try {
      evalExpr(trimmed);
    } catch {}
    steps.push(createStep(i, line, vars, outputs));
    i++;

    // Safety brake to avoid infinite loops in execution
    if (steps.length > 500) {
      steps.push({
        lineIndex: i,
        lineText: "[Execution Terminated: Step limit exceeded]",
        variables: stringifyVars(vars),
        outputs,
        error: "Execution step limit exceeded (infinite loop safety)."
      });
      break;
    }
  }

  return steps;
}

function compileFunction(name: string, params: string[], bodyLines: string[], funcs: Record<string, Function>) {
  // Translate body lines to JS function body
  const jsLines: string[] = [];
  for (const line of bodyLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("return ")) {
      const retExpr = trimmed.substring(7);
      jsLines.push(`  return ${translateExprToJS(retExpr)};`);
    } else {
      // Basic assignments inside function body
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        jsLines.push(`  let ${varName} = ${translateExprToJS(expr)};`);
      } else {
        jsLines.push(`  ${translateExprToJS(trimmed)};`);
      }
    }
  }

  try {
    const fnStr = `function ${name}(${params.join(", ")}) {\n${jsLines.join("\n")}\n}`;
    // Evaluate function declaration in global scope
    const declaredFn = new Function(`return (${fnStr});`)();
    funcs[name] = declaredFn;
  } catch (e) {
    console.error("Failed to compile python function helper:", name, e);
  }
}

function stringifyVars(vars: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(vars)) {
    if (typeof v === "object" && v !== null) {
      result[k] = JSON.stringify(v);
    } else {
      result[k] = String(v);
    }
  }
  return result;
}

function createStep(lineIndex: number, lineText: string, vars: Record<string, any>, outputs: string[]): DebugStep {
  return {
    lineIndex,
    lineText,
    variables: stringifyVars(vars),
    outputs: [...outputs]
  };
}
