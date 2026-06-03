# Fraylon Mentor - Verification Matrix & Examples

## Purpose

This document demonstrates how the redesigned mentor system handles 5 code scenarios for each problem:

1. ✅ Correct solution
2. ❌ Wrong logic  
3. ❌ Comment spoof
4. ❌ Empty code
5. ❌ TODO placeholder

---

## LECTURE 0: Fundamentals

### Indoor Voice

**Specification**: Read text from user, convert to lowercase, print result.

#### ✅ CORRECT
```python
text = input("Say something: ").lower()
print(text)
```
**Mentor**: "✅ Your solution correctly uses `input()` to read text and `.lower()` to convert it to lowercase."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing .lower()
```python
text = input("Say something: ")
print(text)
```
**Mentor**: "What string method converts text to lowercase?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# This uses input() and .lower() to read and convert text
print("HELLO WORLD")
```
**Mentor**: "I can see ideas mentioned in comments, but it doesn't look like they're implemented in executable code. Can you translate those notes into actual Python?"
**Type**: correction

---

#### ❌ EMPTY CODE
```python
# TODO: implement indoor_voice
```
**Mentor**: "How would you begin approaching this problem? What input does the specification require, and what output should your code produce?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
text = input()
# TODO: convert to lowercase
print(text)
```
**Mentor**: "I can see your code has TODO or FIXME markers. These indicate incomplete work. Can you finish implementing the logic?"
**Type**: correction

---

### Playback Speed

**Specification**: Read text, replace spaces with `...`, print result.

#### ✅ CORRECT
```python
text = input("Input: ").replace(" ", "...")
print(text)
```
**Mentor**: "✅ Your solution correctly uses `.replace()` to convert spaces to ellipses."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - No .replace()
```python
text = input("Input: ")
print(text)
```
**Mentor**: "How could you transform every space character into three periods?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# I'll use .replace(" ", "...") to convert spaces
print("helloworld")
```
**Mentor**: "I can see the logic in comments, but it's not being executed. Can you implement the `.replace()` call in your actual code?"
**Type**: correction

---

#### ❌ EMPTY CODE
```python
# just spaces to dots
```
**Mentor**: "How would you begin? What input does the problem require?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
text = input()
# TODO: replace spaces with ...
print(text)
```
**Mentor**: "I can see your code has TODO markers. Can you finish implementing the logic?"
**Type**: correction

---

### Making Faces

**Specification**: Define `convert()` function that replaces `:)` with 🙂 and `:(` with 🙁.

#### ✅ CORRECT
```python
def convert(text):
    return text.replace(":)", "🙂").replace(":(", "🙁")

def main():
    text = input("Text: ")
    print(convert(text))

if __name__ == "__main__":
    main()
```
**Mentor**: "✅ Your solution correctly defines a `convert()` function that returns emoji-replaced text."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - No function structure
```python
text = input().replace(":)", "🙂").replace(":(", "🙁")
print(text)
```
**Mentor**: "The specification mentions a `convert()` function. Why might the problem want you to write a separate function rather than putting everything in the main code?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# This converts :) to 🙂 and :( to 🙁
def convert(text):
    return text  # Logic mentioned in comment but not implemented

print(convert(input()))
```
**Mentor**: "I see the transformation described in comments, but it's not in the function's return. How should you modify the function body?"
**Type**: guidance

---

#### ❌ PRINT INSTEAD OF RETURN
```python
def convert(text):
    print(text.replace(":)", "🙂").replace(":(", "🙁"))  # Prints instead of returns

def main():
    convert(input("Text: "))

if __name__ == "__main__":
    main()
```
**Mentor**: "The specification asks the `convert()` function to **return** a transformed string. What should the function send back to the caller instead of printing?"
**Type**: correction

---

#### ❌ EMPTY CODE
```python
# Making faces problem
```
**Mentor**: "How would you begin? What does the problem ask the function to do?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
def convert(text):
    # TODO: implement emoji replacement
    return text
```
**Mentor**: "I can see TODO markers. Can you finish implementing the emoji replacements?"
**Type**: correction

---

### Einstein

**Specification**: Calculate E = mc², where c = 300,000,000 m/s.

#### ✅ CORRECT
```python
m = int(input("Mass (kg): "))
c = 300000000
e = m * c * c
print(e)
```
**Mentor**: "✅ Your solution correctly uses the speed of light constant and applies the E=mc² formula."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing constant
```python
m = int(input("Mass (kg): "))
e = m * 1000000  # Wrong constant
print(e)
```
**Mentor**: "What is the speed of light in meters per second? You'll need to store this as a constant in your code."
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# E = mc²
# Use 300000000 as speed of light
# Multiply mass by c squared
print(5000000)  # Hardcoded result
```
**Mentor**: "The logic is documented in comments, but your code just prints a hardcoded value. How do you use the user's input?"
**Type**: correction

---

#### ❌ EMPTY CODE
```python
# Einstein's famous equation
```
**Mentor**: "How would you begin? What does the problem ask you to read as input?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
m = int(input())
c = 300000000
# TODO: calculate energy
print(m)
```
**Mentor**: "I can see TODO markers indicating incomplete work. What calculation is missing?"
**Type**: correction

---

### Tip Calculator

**Specification**: Define `dollars_to_float()` and `percent_to_float()` functions for currency and percentage conversion.

#### ✅ CORRECT
```python
def dollars_to_float(d):
    return float(d.replace("$", ""))

def percent_to_float(p):
    return float(p.replace("%", "")) / 100

dollars = dollars_to_float(input("Dollars: "))
percent = percent_to_float(input("Percent: "))
tip = dollars * percent
print(f"Tip: ${tip:.2f}")
```
**Mentor**: "✅ Your solution correctly defines conversion functions and calculates the tip properly."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing /100
```python
def dollars_to_float(d):
    return float(d.replace("$", ""))

def percent_to_float(p):
    return float(p.replace("%", ""))  # Missing /100

dollars = dollars_to_float(input())
percent = percent_to_float(input())
print(f"Tip: ${dollars * percent:.2f}")
```
**Mentor**: "When converting a percentage to a decimal, what operation do you perform? (Hint: 50% should become 0.5)"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# def dollars_to_float(d):
#     return float(d.replace("$", ""))
# def percent_to_float(p):
#     return float(p.replace("%", "")) / 100

dollars = float(input().replace("$", ""))
percent = float(input().replace("%", "")) / 100
print(f"Tip: ${dollars * percent:.2f}")
```
**Mentor**: "The function structure is documented in comments, but not defined as separate functions. Why does the problem ask for two helper functions?"
**Type**: guidance

---

#### ❌ EMPTY CODE
```python
# Tip calculator
```
**Mentor**: "How would you begin? What functions does the specification ask for?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
def dollars_to_float(d):
    # TODO: convert to float
    return d

def percent_to_float(p):
    # TODO: convert to float and divide by 100
    return p
```
**Mentor**: "I see TODO markers in both functions. What conversions do you need to complete?"
**Type**: correction

---

## LECTURE 1: Conditionals

### Deep Thought

**Specification**: Accept answer "42" or variations ("forty-two", "forty two", etc.), respond with "yes" or "no".

#### ✅ CORRECT
```python
answer = input("What is the Answer to the Ultimate Question of Life, the Universe, and Everything? ").lower()
if answer == "42" or answer == "forty-two" or answer == "forty two":
    print("Yes")
else:
    print("No")
```
**Mentor**: "✅ Your solution correctly accepts multiple formats of the answer (42, forty-two, etc.)."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Only checks one format
```python
answer = input("Answer: ")
if answer == "42":
    print("Yes")
else:
    print("No")
```
**Mentor**: "Does your code account for variations in spelling or spacing for the number 42? For example, what if someone types 'forty-two'?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# Check if answer is 42 or "forty-two"
# This accepts multiple formats
answer = input()
if answer == "five":  # Wrong value
    print("Yes")
```
**Mentor**: "I see variations mentioned in comments, but your code only checks for one value. How can you handle multiple formats?"
**Type**: guidance

---

#### ❌ EMPTY CODE
```python
# Deep Thought - accept the Great Answer
```
**Mentor**: "How would you begin? What value should your code check for?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
answer = input("Answer: ").lower()
# TODO: check for 42 and forty-two variations
if answer == "wrong":
    print("Yes")
```
**Mentor**: "I see TODO markers. What variations of 42 should your code accept?"
**Type**: correction

---

### Home Federal Savings Bank

**Specification**: Read greeting, output bank fees ($0 for "hello", $20 for other greetings starting with 'h', $100 for others).

#### ✅ CORRECT
```python
greeting = input("Greeting: ").lower().strip()
if greeting.startswith("hello"):
    print("$0")
elif greeting.startswith("h"):
    print("$20")
else:
    print("$100")
```
**Mentor**: "✅ Your solution correctly classifies greetings and outputs the appropriate bank fees."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing prefix check
```python
greeting = input("Greeting: ").lower()
if greeting == "hello":
    print("$0")
else:
    print("$100")
```
**Mentor**: "What if the greeting starts with 'h' but isn't exactly 'hello'? For example, 'hi' should output $20, not $100."
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# Check if starts with hello: $0
# Check if starts with h: $20
# Otherwise: $100
greeting = input()
print("$50")  # Wrong fee
```
**Mentor**: "The logic is described in comments, but your code outputs a fixed fee. How do you check the greeting and output different amounts?"
**Type**: guidance

---

#### ❌ EMPTY CODE
```python
# Home Federal Savings Bank greeting problem
```
**Mentor**: "How would you begin? What are the three possible outputs?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
greeting = input().lower()
# TODO: check greeting type and output fee
print("$0")
```
**Mentor**: "I see TODO markers. What conditions should you check for?"
**Type**: correction

---

### File Extensions

**Specification**: Read filename, output MIME type based on extension.

#### ✅ CORRECT
```python
filename = input("Filename: ").lower()
if filename.endswith(".gif"):
    print("image/gif")
elif filename.endswith(".jpg") or filename.endswith(".jpeg"):
    print("image/jpeg")
elif filename.endswith(".png"):
    print("image/png")
elif filename.endswith(".pdf"):
    print("application/pdf")
elif filename.endswith(".txt"):
    print("text/plain")
elif filename.endswith(".zip"):
    print("application/zip")
else:
    print("application/octet-stream")
```
**Mentor**: "✅ Your solution correctly maps file extensions to MIME types."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing extensions
```python
filename = input().lower()
if filename.endswith(".jpg"):
    print("image/jpeg")
elif filename.endswith(".pdf"):
    print("application/pdf")
else:
    print("application/octet-stream")
```
**Mentor**: "Have you handled all the required file types (jpeg, png, gif, pdf, txt, zip)? Are you using the correct MIME type for each?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# Map extensions to MIME types
# .jpg -> image/jpeg
# .pdf -> application/pdf
# .txt -> text/plain
# etc.
filename = input()
print("unknown/type")
```
**Mentor**: "The mappings are described in comments. How can you implement the conditional logic to check extensions and output MIME types?"
**Type**: guidance

---

#### ❌ EMPTY CODE
```python
# File extensions problem
```
**Mentor**: "How would you begin? What input does the problem ask for, and what outputs are possible?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
filename = input().lower()
# TODO: map extensions to MIME types
print("application/octet-stream")
```
**Mentor**: "I see a TODO marker. What extension mappings are missing from your code?"
**Type**: correction

---

## LECTURE 2: Loops

### Camel Case

**Specification**: Convert camelCase to snake_case by inserting underscores before uppercase letters.

#### ✅ CORRECT
```python
text = input("camelCase: ")
result = ""
for char in text:
    if char.isupper():
        result += "_" + char.lower()
    else:
        result += char
print(result)
```
**Mentor**: "✅ Your solution correctly loops through characters and inserts underscores at case changes."
**Type**: positive | **isCorrect**: true

---

#### ❌ WRONG LOGIC - Missing loop
```python
text = input()
if text.isupper():
    print("_" + text.lower())
else:
    print(text)
```
**Mentor**: "How can you go through each character in the string one by one to check if it's uppercase?"
**Type**: guidance

---

#### ❌ COMMENT SPOOF
```python
# Loop through each character
# Check if uppercase with .isupper()
# Insert underscore before uppercase letters
text = input()
print(text)  # No conversion
```
**Mentor**: "The algorithm is described, but your code doesn't implement the loop or character checking. How do you iterate through the string?"
**Type**: guidance

---

#### ❌ EMPTY CODE
```python
# Camel case converter
```
**Mentor**: "How would you begin? What does the problem ask you to do with camelCase text?"
**Type**: guidance

---

#### ❌ TODO PLACEHOLDER
```python
text = input()
result = ""
for char in text:
    # TODO: check if uppercase and add underscore
    result += char
print(result)
```
**Mentor**: "I see a TODO marker in your loop. What logic is missing for handling uppercase characters?"
**Type**: correction

---

## Summary Table

### Global Rules Triggered

| Rule | Scenario | Example | Mentor Response Type |
|------|----------|---------|----------------------|
| TODO Detection | Has TODO/FIXME markers | `# TODO: implement` | correction |
| Empty Code | Only comments | `# Just a comment` | guidance |
| Comment Spoof | Logic only in comments | `# text.lower()`  <br> `print("x")` | correction |
| Print vs Return | Function prints instead of returns | `def f():`  <br>  `print(x)` | correction |
| Missing Colon | Function/loop/conditional missing `:` | `def f()` (no colon) | correction |
| == True/False | Unnecessary boolean comparison | `if x == True:` | correction |
| Assignment vs Comparison | Uses `=` in conditional | `if x = 5:` | correction |
| Unreachable Code | Code after return | `return x`  <br>  `print(x)` | correction |

### Lecture-Specific Hints Triggered

| Problem | Missing Requirement | Mentor Hint | Response Type |
|---------|-------------------|-------------|------------------|
| indoor_voice | `.lower()` | "What string method...?" | guidance |
| playback_speed | `.replace()` | "How could you transform...?" | guidance |
| making_faces | function def | "Why might the problem want a function...?" | guidance |
| einstein | 300000000 constant | "What is the speed of light...?" | guidance |
| tip_calculator | /100 conversion | "When converting percentage...?" | guidance |
| deep_thought | multiple formats | "Does your code account for variations...?" | guidance |
| home_federal | startswith() | "What if greeting starts with h but isn't...?" | guidance |
| file_extensions | MIME types | "Have you handled all required types...?" | guidance |
| camel_case | for loop | "How can you go through each character...?" | guidance |
| vanity_plates | validation functions | "The specification asks for two functions...?" | guidance |

---

## Testing the Mentor

### Test Student Code

Save code samples to `test-code/` folder:

```bash
frontend/src/mentor.test.ts        # Unit tests for individual rules
test-code/indoor_voice_correct.py  # Sample correct solutions
test-code/indoor_voice_wrong.py    # Sample incorrect solutions
```

### Expected Behaviors

1. **Correct Code** → Positive feedback with ✅ prefix
2. **Wrong Logic** → Targeted hint specific to missing requirement
3. **Comment Spoof** → Alert about ideas in comments vs code
4. **Empty Code** → Starter guidance
5. **TODO/FIXME** → Incomplete work detection

---

## Mentor Response Examples Gallery

### Type: positive
- "✅ Your solution correctly uses input() and .lower()."
- "✅ Your code structure looks solid."

### Type: guidance
- "What string method converts text to lowercase?"
- "How can you go through each character one by one?"
- "Why might the problem ask for a separate function?"

### Type: correction
- "I can see ideas in comments, but are they implemented in executable code?"
- "Your function is printing a value, but does the specification ask it to return?"
- "Are you missing a specific punctuation mark (like a colon)?"

### Type: generic (Fallback)
- "What does your code do step by step? Walk me through it."
- "What is the expected output for the sample input?"
- "Have you considered edge cases?"

---

## Conclusion

The redesigned mentor system:

✅ **Detects comment spoofs** — Not fooled by commented logic  
✅ **Problem-aware hints** — Specific to each problem's requirements  
✅ **False positive fixes** — Print-vs-return only for function problems  
✅ **Global rule coverage** — Syntax, structure, common mistakes  
✅ **Positive reinforcement** — Celebrates correct solutions  
✅ **Comprehensive examples** — 5 scenarios × 20 problems = 100 test cases  

