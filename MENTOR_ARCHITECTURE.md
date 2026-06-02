# Fraylon Mentor System - Architecture & Design

## Overview

The **Fraylon Mentor** is a problem-aware Socratic tutoring system that provides targeted hints based on student code analysis, lecture content, and specific problem requirements.

**Key Principle**: Guide without revealing solutions.

---

## Architecture

### Files

- `frontend/src/mentor.ts` — Core hint logic (1,000+ lines)
- `frontend/src/api.ts` — Integrates mentor into chat API
- `frontend/src/Shell.tsx` — Renders mentor chat UI

### System Flow

```
Student Code → Mentor.ts Analysis → Problem-Specific Rules → Hint Response
                      ↓
                Code Analysis Engine
                (Comments, Keywords, Functions, etc.)
                      ↓
                Global Rules (Syntax, TODO, Empty, etc.)
                      ↓
                Lecture-Specific Rules (0-8)
                      ↓
                Generic Socratic Hints (Fallback)
```

---

## Features

### ✅ Implemented

1. **Comment-Spoof Detection**
   - Detects keywords only in comments
   - Guides student to implement in code, not just document
   - Example: `# text.lower()` → "Are these ideas implemented in code?"

2. **Empty Code Detection**
   - Catches submissions with only comments/whitespace
   - Provides starter guidance

3. **TODO/FIXME Detection**
   - Catches incomplete solutions with markers
   - Example: `# TODO: implement this`

4. **Print vs Return Detection**
   - Only triggers for function-based problems (28 problems)
   - Guides on function return values vs printing
   - Prevents false positives on script-style problems

5. **Lecture-Specific Hints** (Lectures 0-2 fully implemented)
   - Indoor Voice → `.lower()`
   - Playback Speed → `.replace()`
   - Making Faces → function structure + emoji
   - Einstein → E=mc² calculation
   - Tip Calculator → float conversion
   - Deep Thought → alternate spellings (42, forty-two, etc.)
   - Home Federal → greeting analysis + bank fees
   - File Extensions → MIME type mappings
   - Math Interpreter → arithmetic parsing
   - Meal Time → time conversion functions
   - Camel Case → loop + `.isupper()`
   - Coke Machine → while loop + coin values
   - Twttr → vowel removal
   - Vanity Plates → function definitions + validation
   - Nutrition Facts → dictionary lookup + case handling

6. **Syntax Error Detection**
   - Missing colons on functions/loops/conditionals
   - Assignment vs comparison (`=` vs `==`)
   - Unreachable code after return

7. **Common Mistake Detection**
   - `== True` / `== False` comparisons
   - Missing required functions
   - Missing required keywords/methods

---

## Code Analysis Engine

### analyzeCode(code: string) → CodeAnalysis

Extracts metadata from student code:

```typescript
{
  hasComments: boolean;           // Has # comments
  codeWithoutComments: string;    // Code with comments stripped
  normalized: string;              // lowercase, no whitespace
  normalizedLower: string;         // same as normalized
  hasFunctionDef: boolean;         // Has def statements
  functionNames: string[];         // Names of all functions
  hasReturn: boolean;              // Has return statement
  hasPrint: boolean;               // Has print() calls
  hasInput: boolean;               // Has input() calls
  hasImport: boolean;              // Has import statements
  hasClass: boolean;               // Has class definition
  isEmpty: boolean;                // No code after comment removal
  hasTodo: boolean;                // Has TODO/FIXME markers
  keywords: Map<string, boolean>;  // Cached keyword checks
}
```

---

## Global Rules (Applied to All Problems)

### 1. TODO/FIXME Detection
**Triggers**: Code contains TODO, FIXME, HACK, XXX, or PLACEHOLDER (case-insensitive)
**Message**: "I can see your code has TODO or FIXME markers. These indicate incomplete work. Can you finish implementing the logic?"
**Type**: correction

### 2. Empty Code
**Triggers**: All code is comments or whitespace
**Message**: "How would you begin approaching this problem? What input does the specification require..."
**Type**: guidance

### 3. Comment Spoof Detection
**Triggers**: Keywords only exist in comments, not in executable code
**Message**: "I can see ideas mentioned in comments, but it doesn't look like they're implemented in executable code. Can you translate those notes into actual Python?"
**Type**: correction
**Example**:
```python
# text.lower()  ❌ Only in comment
print("hello")   # Doesn't use .lower()
```

### 4. Missing Colons
**Triggers**: Function/loop/conditional definitions without `:` at end
**Message**: "Are you missing a specific punctuation mark (like a colon `:`) at the end of a function, conditional, or loop definition?"
**Type**: correction
**Example**:
```python
def convert(text)    # ❌ Missing :
    return text
```

### 5. Boolean Comparison
**Triggers**: Code uses `== True` or `== False`
**Message**: "Do you need to explicitly compare against True or False, or does the expression already evaluate to a boolean?"
**Type**: correction
**Example**:
```python
if x == True:    # ❌ Unnecessary
    ...
if x:            # ✅ Correct
    ...
```

### 6. Assignment vs Comparison
**Triggers**: Uses `=` instead of `==` in conditional
**Message**: "Are you assigning a value with `=` or comparing two values with `==`? Check which one makes sense here."
**Type**: correction
**Example**:
```python
if x = 5:        # ❌ Assignment (syntax error)
    ...
if x == 5:       # ✅ Comparison
    ...
```

### 7. Unreachable Code
**Triggers**: Code after return statement
**Message**: "Look at what happens after your return statement. Will that code ever execute?"
**Type**: correction
**Example**:
```python
return x
print(x)         # ❌ Never executes
```

### 8. Print vs Return (Function Problems Only)
**Triggers**: Function definitions with `print()` but no `return`
**Condition**: Only for 28 "function problems" (making_faces, tip_calculator, meal_time, etc.)
**Message**: "Your function is printing a value, but the specification asks the function to **return** a value. What's the difference, and how should you modify your code?"
**Type**: correction
**Example**:
```python
def convert(text):
    print(text)      # ❌ Prints instead of returns
    
# Should be:
def convert(text):
    return text      # ✅ Returns the value
```

---

## Lecture-Specific Rules

### LECTURE 0: Fundamentals

#### Indoor Voice
```python
# Required
input(...)       # Read from user
.lower()         # Convert to lowercase
print(...)       # Output result

# Hint if missing .lower():
"What string method converts text to lowercase?"

# Positive feedback:
"✅ Your solution correctly uses input() to read text and .lower() to convert it."
```

#### Playback Speed
```python
# Required
input(...)       # Read from user
.replace()       # Transform spaces
"..."            # Literal string with 3 dots
print(...)       # Output result

# Hint if missing .replace():
"How could you transform every space character into three periods?"
```

#### Making Faces
```python
# Required
def convert(...)     # Function definition
.replace()          # Emoji replacement
🙂 and 🙁           # Both emoji characters
return              # Must return, not print

# Hint if missing function:
"The specification mentions a convert() function. Why might the problem want you to write a separate function...?"

# Hint if function prints instead of returns:
"The specification asks the convert() function to **return** a transformed string. What should the function send back?"
```

#### Einstein
```python
# Required
input(...)       # Read mass
int()            # Convert to integer
300000000        # Speed of light constant
*                # Multiplication for E=mc²
print(...)       # Output energy

# Hint if missing constant:
"What is the speed of light in meters per second? You'll need to store this as a constant."
```

#### Tip Calculator
```python
# Required
def dollars_to_float()    # Function definition
def percent_to_float()    # Function definition
float()                   # Convert to decimal
/100                      # Percentage conversion
.replace() or .strip()    # Remove $ or %

# Hint if missing functions:
"The specification asks for two helper functions. What are they, and what should each return?"

# Hint if missing /100:
"When converting a percentage to a decimal, what operation do you perform?"
```

### LECTURE 1: Conditionals

#### Deep Thought
- Check for: `42`, `forty-two`, `fortytwo` (multiple formats)
- Guide: "Does your code account for variations in spelling or spacing for the number 42?"
- Positive: "Your solution correctly accepts multiple formats of the answer."

#### Home Federal Savings Bank
- Check for: `hello`, `startswith()` or `[0]`, bank fees (`0`, `20`, `100`)
- Guide: "What if the greeting starts with 'h' but isn't exactly 'hello'?"
- Positive: "Your solution correctly classifies greetings and outputs appropriate fees."

#### File Extensions
- Check for: `endswith()` or `.split()`, MIME types (jpeg, png, gif, pdf, txt, zip)
- Guide: "Have you handled all the required file types and MIME types?"
- Positive: "Your solution correctly maps file extensions to MIME types."

#### Math Interpreter
- Check for: `.split()`, `int()`, arithmetic operators, output formatting
- Guide: "How can you break down a mathematical expression into its parts?"
- Positive: "Your solution correctly parses and evaluates arithmetic expressions."

#### Meal Time
- Check for: `def convert()`, `def main()`, `.split()`, meal periods
- Guide: "The specification mentions convert() and main() functions..."
- Positive: "Your solution correctly converts times and classifies meals."

### LECTURE 2: Loops

#### Camel Case
- Check for: `for` loop, `.isupper()` or `.islower()`, underscore `_`
- Guide: "What string method lets you check if a character is uppercase?"
- Positive: "Your solution correctly loops through and inserts underscores at case changes."

#### Coke Machine
- Check for: `while` loop, `amountdue:`, coin values (25, 10, 5)
- Guide: "The machine should keep accepting coins until paid. What loop structure suggests that?"
- Positive: "Your solution correctly implements a coin-acceptance loop."

#### Twttr (just_setting_up)
- Check for: `aeiou` reference, vowel removal logic
- Guide: "Your code should remove vowels. How can you identify all the vowels?"
- Positive: "Your solution correctly removes vowels from text."

#### Vanity Plates
- Check for: `def main()`, `def is_valid()`, `len()`, `.isalpha()`, `.isalnum()`, `.isdigit()`
- Guide: "The specification asks for two functions..."
- Positive: "Your solution correctly validates vanity plate format."

#### Nutrition Facts
- Check for: `input()`, `calories:` output, case methods (`.title()`, `.lower()`, etc.)
- Guide: "Your code should handle fruit names regardless of capitalization..."
- Positive: "Your solution correctly looks up and displays calorie information."

---

## Verification Matrix

### Test Cases for Each Problem

For each problem, the mentor should:

| Code | Expected | Mentor Response |
|------|----------|-----------------|
| ✅ Correct implementation | PASS | Positive feedback ("✅ Your solution...") |
| ❌ Missing key requirement | FAIL | Targeted hint ("What method...?") |
| ❌ Keywords in comments | FAIL | Comment spoof detection ("...implemented in executable code?") |
| ❌ TODO/FIXME markers | FAIL | Incomplete detection ("...finish implementing...?") |
| ❌ Empty/comment-only | FAIL | Starter guidance ("How would you begin...?") |
| ❌ Print instead of return (functions) | FAIL | Print-vs-return hint ("...function to return a value...?") |
| ❌ Syntax errors | FAIL | Syntax-focused hint ("...missing colon...?") |

### Example: Indoor Voice

```python
# ✅ CORRECT
text = input("Say something: ").lower()
print(text)
→ Mentor: "✅ Your solution correctly uses input() to read text and .lower() to convert it."

# ❌ MISSING .lower()
text = input("Say something: ")
print(text)
→ Mentor: "What string method converts text to lowercase?"

# ❌ COMMENT SPOOF
# text.lower()
print("hello")
→ Mentor: "I can see ideas mentioned in comments, but it doesn't look like they're implemented in executable code..."

# ❌ EMPTY
# Just a comment
→ Mentor: "How would you begin approaching this problem? What input does the specification require...?"

# ❌ TODO
# TODO: implement .lower()
print(input())
→ Mentor: "I can see your code has TODO markers. These indicate incomplete work. Can you finish implementing the logic?"
```

---

## Mentor Response Types

```typescript
type HintResponse = {
  type: 'positive' | 'correction' | 'guidance' | 'generic';
  hint: string;
  isCorrect?: boolean;
};
```

- **positive**: Student did it right (usually has `✅` prefix)
- **correction**: Student made a mistake (usually phrased as question)
- **guidance**: Student is on the right track, guide next step
- **generic**: Fallback Socratic hints (worst case)

---

## Problem Classification

### Function-Based Problems (28 total)

These problems **require** a function that **returns** a value:

- **Lecture 0**: making_faces, tip_calculator
- **Lecture 1**: meal_time
- **Lecture 2**: vanity_plates
- **Lecture 3**: fuel, taqueria, grocery, outdated
- **Lecture 4**: emojize, figlet, adieu, game, professor, bitcoin
- **Lecture 6**: lines, pizza, scourgify, shirt
- **Lecture 7**: numb3rs, watch, working, um, response
- **Lecture 8**: jar, seasons, shirtificate

### Script-Based Problems (20 total)

These problems **do not** require functions:

- **Lecture 0**: indoor_voice, playback_speed, einstein
- **Lecture 1**: deep_thought, home_federal, file_extensions, math_interpreter
- **Lecture 2**: camel_case, coke_machine, nutrition_facts
- **Lecture 3**: (none in lecture 3)
- **Lecture 4**: (none)
- **Lecture 6**: (none)
- **Lecture 7**: (none)
- **Lecture 8**: (none)

**Print-vs-return rule only applies to function-based problems.**

---

## Adding New Hints

### To Add a Lecture 3+ Problem

1. **Open** `frontend/src/mentor.ts`
2. **Find** the `hintLecture3Plus()` function
3. **Add** your problem's detection logic:

```typescript
if (slug.includes("problem_name")) {
  if (!normalized.includes("required_keyword")) {
    return {
      type: 'guidance',
      hint: "What does X do? How do you use it?",
    };
  }
  return {
    type: 'positive',
    hint: "✅ Your solution correctly does X.",
    isCorrect: true,
  };
}
```

4. **Test** with sample student code
5. **Commit** with message: `"Enhance mentor: Add rules for {problem_name}"`

---

## Common Patterns

### Checking for Keywords

```typescript
// After comment removal
const normalized = analysis.normalizedLower;

// Check for single keyword
if (!normalized.includes("keyword(")) {
  // guide student
}

// Check for multiple keywords (all required)
if (!normalized.includes("keyword1") || !normalized.includes("keyword2")) {
  // guide student
}

// Check for at least one of several
const hasOne = ["method1(", "method2(", "method3("].some(m => normalized.includes(m));
if (!hasOne) {
  // guide student
}
```

### Checking for Specific Patterns

```typescript
// Regex on code without comments
if (!/def\s+convert\s*\(/.test(analysis.codeWithoutComments)) {
  // guide on function definition
}

if (!/\.replace\(["']\s["']\s*,\s*["']\.\.\.["']\)/.test(analysis.codeWithoutComments)) {
  // guide on specific replace() call
}
```

### Positive Feedback

```typescript
return {
  type: 'positive',
  hint: "✅ Your solution correctly does X and Y.",
  isCorrect: true,
};
```

---

## Design Principles

1. **Socratic, Not Authoritative**
   - Guide with questions
   - Never say "You must do X"
   - Instead ask "What happens when...?"

2. **Problem-Aware**
   - Know the specific requirements
   - Reference the problem name/context
   - Use vocabulary from the spec

3. **Context-Sensitive**
   - Analyze the actual code, not just keywords
   - Check for comment spoofs
   - Detect incomplete implementations

4. **Actionable**
   - Each hint should guide to the next step
   - Not vague or generic
   - Specific to the student's code

5. **Encouraging**
   - Recognize effort and progress
   - Celebrate correct solutions
   - Build confidence

---

## Future Enhancements

1. **AST-Based Analysis** (Phase 2)
   - Parse Python to abstract syntax tree
   - Verify function signatures
   - Check variable scope and usage

2. **Behavioral Testing** (Phase 3)
   - Run code with test inputs
   - Compare output to expected
   - Provide test-case-specific hints

3. **ML-Based Feedback** (Phase 4)
   - Plagiarism detection
   - Common misconception detection
   - Personalized learning paths

4. **LLM Integration**
   - Replace hardcoded hints with Claude API
   - Maintain Socratic teaching style
   - Keep comment-spoof and pattern detection

---

## Summary

The Fraylon Mentor system provides:

✅ **Comment-spoof detection** — Knows when ideas are only documented, not implemented  
✅ **Problem-aware hints** — Specific guidance per problem  
✅ **Global rule engine** — Syntax, structure, and common mistakes  
✅ **Print vs return detection** — Only for function-based problems  
✅ **Positive feedback** — Encourages correct solutions  
✅ **Fallback hints** — Never leaves student without guidance  

**Philosophy**: Guide thinking, never reveal solutions.

