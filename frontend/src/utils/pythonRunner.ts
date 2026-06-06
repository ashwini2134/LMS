// Minimal Python interpreter for CS50P introductory exercises.
// Handles: variables, print, f-strings, basic arithmetic, simple functions.

type PyVal = string | number | boolean | null;
type Env = Map<string, PyVal>;
type FnDef = { params: string[]; bodyLines: string[] };

export interface RunResult {
  output: string;
  error: string | null;
}

export function runPython(code: string): RunResult {
  return new MiniPython().run(code);
}

class MiniPython {
  private globals: Env = new Map();
  private fns: Map<string, FnDef> = new Map();
  private out: string[] = [];

  run(code: string): RunResult {
    try {
      this.execLines(code.split('\n'), 0, this.globals);
      return { output: this.out.join('\n'), error: null };
    } catch (e) {
      return { output: this.out.join('\n'), error: String(e instanceof Error ? e.message : e) };
    }
  }

  private indent(line: string): number {
    let n = 0;
    for (const c of line) {
      if (c === ' ') n++;
      else if (c === '\t') n += 4;
      else break;
    }
    return n;
  }

  private execLines(lines: string[], base: number, env: Env): void {
    let i = 0;
    while (i < lines.length) {
      const raw = lines[i];
      const t = raw.trim();
      if (!t || t.startsWith('#')) { i++; continue; }

      const ind = this.indent(raw);
      if (ind < base && t) break;

      // Function definition
      const defM = t.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:/);
      if (defM) {
        const name = defM[1];
        const params = defM[2].split(',').map(s => s.trim()).filter(Boolean);
        const body: string[] = [];
        i++;
        while (i < lines.length) {
          const bl = lines[i];
          const bt = bl.trim();
          if (bt && this.indent(bl) <= ind) break;
          body.push(bl);
          i++;
        }
        this.fns.set(name, { params, bodyLines: body });
        continue;
      }

      // print()
      if (t.match(/^print\s*\(/)) {
        const inner = this.unParen(t.slice(t.indexOf('(')));
        this.out.push(this.repr(this.eval(inner, env)));
        i++; continue;
      }

      // Augmented assignment  x += 1
      const augM = t.match(/^([a-zA-Z_]\w*)\s*([+\-*\/])=\s*(.+)$/);
      if (augM) {
        const cur = this.eval(augM[1], env) ?? 0;
        const rhs = this.eval(augM[3].trim(), env) ?? 0;
        const op = augM[2];
        let res: PyVal;
        if (op === '+' && (typeof cur === 'string' || typeof rhs === 'string')) res = String(cur) + String(rhs);
        else if (op === '+') res = Number(cur) + Number(rhs);
        else if (op === '-') res = Number(cur) - Number(rhs);
        else if (op === '*') res = Number(cur) * Number(rhs);
        else res = Number(cur) / Number(rhs);
        env.set(augM[1], res);
        i++; continue;
      }

      // Variable assignment  x = expr
      const assignM = t.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (assignM) {
        env.set(assignM[1], this.eval(assignM[2].trim(), env));
        i++; continue;
      }

      // Standalone function call
      const callM = t.match(/^([a-zA-Z_]\w*)\s*\((.*)?\)\s*$/);
      if (callM) {
        this.call(callM[1], callM[2] ?? '', env);
        i++; continue;
      }

      i++;
    }
  }

  private runBody(lines: string[], env: Env): PyVal {
    let baseInd = Infinity;
    for (const l of lines) {
      if (l.trim()) { baseInd = this.indent(l); break; }
    }
    if (!isFinite(baseInd)) return null;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const t = raw.trim();
      if (!t || t.startsWith('#')) continue;

      if (t.startsWith('return ')) return this.eval(t.slice(7).trim(), env);

      if (t.match(/^print\s*\(/)) {
        const inner = this.unParen(t.slice(t.indexOf('(')));
        this.out.push(this.repr(this.eval(inner, env)));
        continue;
      }

      const augM = t.match(/^([a-zA-Z_]\w*)\s*([+\-*\/])=\s*(.+)$/);
      if (augM) {
        const cur = this.eval(augM[1], env) ?? 0;
        const rhs = this.eval(augM[3].trim(), env) ?? 0;
        const op = augM[2];
        if (op === '+' && (typeof cur === 'string' || typeof rhs === 'string')) env.set(augM[1], String(cur) + String(rhs));
        else if (op === '+') env.set(augM[1], Number(cur) + Number(rhs));
        else if (op === '-') env.set(augM[1], Number(cur) - Number(rhs));
        else if (op === '*') env.set(augM[1], Number(cur) * Number(rhs));
        else env.set(augM[1], Number(cur) / Number(rhs));
        continue;
      }

      const assignM = t.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (assignM) {
        env.set(assignM[1], this.eval(assignM[2].trim(), env));
        continue;
      }

      const callM = t.match(/^([a-zA-Z_]\w*)\s*\((.*)?\)\s*$/);
      if (callM) { this.call(callM[1], callM[2] ?? '', env); continue; }
    }
    return null;
  }

  private call(name: string, argsStr: string, env: Env): PyVal {
    // Built-ins
    if (name === 'str') return String(this.eval(argsStr, env));
    if (name === 'int') return Math.trunc(Number(this.eval(argsStr, env)));
    if (name === 'float') return parseFloat(String(this.eval(argsStr, env)));
    if (name === 'len') { const v = this.eval(argsStr, env); return typeof v === 'string' ? v.length : 0; }
    if (name === 'input') return '[user input]';
    if (name === 'print') { this.out.push(this.repr(this.eval(argsStr, env))); return null; }
    if (name === 'range') return null; // not supported
    if (name === 'upper' || name === 'lower' || name === 'strip') return null;

    const fn = this.fns.get(name);
    if (!fn) throw new Error(`NameError: name '${name}' is not defined`);

    const argVals = argsStr.trim() ? this.parseArgs(argsStr, env) : [];
    const local: Env = new Map(this.globals);
    fn.params.forEach((p, i) => local.set(p, argVals[i] ?? null));
    return this.runBody(fn.bodyLines, local);
  }

  private eval(expr: string, env: Env): PyVal {
    expr = expr.trim();
    if (!expr) return null;

    // f-string
    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      const quote = expr[1];
      const inner = expr.slice(2, expr.lastIndexOf(quote));
      return inner.replace(/\{([^}]+)\}/g, (_, e) => {
        try { return this.repr(this.eval(e.trim(), env)); } catch { return `{${e}}`; }
      });
    }

    // Triple-quoted strings
    if (expr.startsWith('"""') && expr.endsWith('"""')) return expr.slice(3, -3);
    if (expr.startsWith("'''") && expr.endsWith("'''")) return expr.slice(3, -3);

    // String literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }

    // Keyword literals
    if (expr === 'None') return null;
    if (expr === 'True') return true;
    if (expr === 'False') return false;

    // Numeric literals
    if (/^-?\d+$/.test(expr)) return parseInt(expr, 10);
    if (/^-?\d*\.\d+$/.test(expr)) return parseFloat(expr);

    // String multiply: "=" * 3
    const mulStrM = expr.match(/^(['"])(.*)\1\s*\*\s*(\d+)$/);
    if (mulStrM) return mulStrM[2].repeat(parseInt(mulStrM[3], 10));

    // Binary operators (scan right-to-left, skip strings/parens)
    const bin = this.findBinOp(expr);
    if (bin) {
      const [lhs, op, rhs] = bin;
      const lv = this.eval(lhs, env);
      const rv = this.eval(rhs, env);
      if (op === '+' && (typeof lv === 'string' || typeof rv === 'string')) return String(lv ?? '') + String(rv ?? '');
      if (op === '+') return Number(lv) + Number(rv);
      if (op === '-') return Number(lv) - Number(rv);
      if (op === '*') return Number(lv) * Number(rv);
      if (op === '//') return Math.floor(Number(lv) / Number(rv));
      if (op === '/') return Number(lv) / Number(rv);
      if (op === '%') return Number(lv) % Number(rv);
    }

    // Function call
    const fnM = expr.match(/^([a-zA-Z_]\w*)\s*\((.*)?\)$/);
    if (fnM) return this.call(fnM[1], fnM[2] ?? '', env);

    // Variable
    if (/^[a-zA-Z_]\w*$/.test(expr)) {
      if (env.has(expr)) return env.get(expr)!;
      if (this.globals.has(expr)) return this.globals.get(expr)!;
      throw new Error(`NameError: name '${expr}' is not defined`);
    }

    return null;
  }

  private repr(v: PyVal): string {
    if (v === null) return 'None';
    if (typeof v === 'boolean') return v ? 'True' : 'False';
    return String(v);
  }

  private unParen(s: string): string {
    if (!s.startsWith('(')) return s;
    let d = 0, start = -1;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') { if (!d) start = i + 1; d++; }
      else if (s[i] === ')') { d--; if (!d) return s.slice(start, i); }
    }
    return s.slice(1);
  }

  private parseArgs(argsStr: string, env: Env): PyVal[] {
    // Split by top-level commas
    const parts: string[] = [];
    let cur = '', depth = 0, inStr = false, strCh = '';
    for (const ch of argsStr) {
      if (!inStr && (ch === '"' || ch === "'")) { inStr = true; strCh = ch; cur += ch; }
      else if (inStr && ch === strCh) { inStr = false; cur += ch; }
      else if (!inStr && ch === '(') { depth++; cur += ch; }
      else if (!inStr && ch === ')') { depth--; cur += ch; }
      else if (!inStr && ch === ',' && !depth) { parts.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts.map(p => this.eval(p, env));
  }

  private findBinOp(expr: string): [string, string, string] | null {
    const ops = ['+', '-', '*', '//', '/', '%'];
    let inStr = false, strCh = '', depth = 0;
    for (let i = expr.length - 1; i >= 1; i--) {
      const ch = expr[i];
      if (ch === ')') depth++;
      else if (ch === '(') depth--;
      else if (!inStr && (ch === '"' || ch === "'")) { inStr = true; strCh = ch; }
      else if (inStr && ch === strCh) inStr = false;
      if (!inStr && !depth) {
        for (const op of ops) {
          if (expr.slice(i, i + op.length) === op) {
            const lhs = expr.slice(0, i).trim();
            const rhs = expr.slice(i + op.length).trim();
            if (lhs && rhs && !lhs.endsWith('=')) return [lhs, op, rhs];
          }
        }
      }
    }
    return null;
  }
}
