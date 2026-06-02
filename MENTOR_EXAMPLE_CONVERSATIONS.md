# Fraylon Mentor - Example Conversations

Real-world mentor interactions showing the new system in action.

---

## Example 1: Correct Solution - Positive Feedback

### Problem: Indoor Voice (Lecture 0)

**Student Code**:
```python
text = input("Say something: ").lower()
print(text)
```

**Student Message**: "Is this right?"

**Mentor Analysis**:
1. ✅ Has `input(` 
2. ✅ Has `.lower(` in executable code
3. ✅ Has `print(`
4. ❌ Not in comments only
5. ✅ No TODO/FIXME markers
6. ✅ Not empty

**Mentor Response**:
> "✅ Your solution correctly uses `input()` to read text and `.lower()` to convert it to lowercase. Your logic looks solid!"

**Type**: positive | **isCorrect**: true

---

## Example 2: Missing Key Method

### Problem: Playback Speed (Lecture 0)

**Student Code**:
```python
text = input("Input: ")
# Need to replace spaces with dots
print(text)
```

**Student Message**: "Help, I'm stuck"

**Mentor Analysis**:
1. ✅ Has `input(`
2. ❌ Missing `.replace(` in executable code
3. ✅ Has `print(`
4. ⚠️ Has comment about `.replace` but not in code
5. ✅ Not empty
6. ✅ No TODO

**Mentor Response**:
> "I see the idea in your comment, but the transformation isn't in your actual code. How could you transform every space character into three periods? What string method could help?"

**Type**: correction → guidance

---

## Example 3: Comment Spoof Attack

### Problem: Making Faces (Lecture 0)

**Student Code**:
```python
# def convert(text):
#     return text.replace(":)", "🙂").replace(":(", "🙁")
# 
# def main():
#     text = input("Text: ")
#     print(convert(text))

print("Done")
```

**Student Message**: "Check my code"

**Mentor Analysis**:
1. ❌ Has `def convert` but in comments
2. ✅ Has emoji characters but in comments
3. ✅ Not in executable code (only in comments)
4. Code after comment removal: just `print("Done")`
5. ✅ Not empty (but trivial)
6. ✅ No TODO

**Mentor Response**:
> "I can see the function structure and emoji replacements described in comments, but they're not in your executable code. Can you uncomment and complete the `convert()` function? The specification asks it to **return** a value, not print."

**Type**: correction

---

## Example 4: Empty/Incomplete Code

### Problem: Einstein (Lecture 0)

**Student Code**:
```python
# E = mc^2
# m = mass
# c = speed of light = 300,000,000 m/s
```

**Student Message**: "Not sure where to start"

**Mentor Analysis**:
1. ✅ Has comments describing the problem
2. ❌ No executable code after comment removal
3. ❌ isEmpty: true
4. Has comments about `300000000` but not in code

**Mentor Response**:
> "Great, you've documented the physics! Now let's implement it. First, how do you ask the user for the mass? What Python function reads input?"

**Type**: guidance

---

## Example 5: TODO Placeholder

### Problem: Tip Calculator (Lecture 0)

**Student Code**:
```python
def dollars_to_float(d):
    # TODO: remove $ and convert to float
    return d

def percent_to_float(p):
    # TODO: remove % and convert to float, divide by 100
    return p

# Main code
dollars = float(input("Dollars: "))
percent = float(input("Percent: "))
print(f"Tip: ${dollars * percent:.2f}")
```

**Student Message**: "Work in progress"

**Mentor Analysis**:
1. ✅ Has function definitions
2. ❌ Has TODO markers in comments
3. ✅ Functions exist but incomplete
4. ❌ hasTodo: true

**Mentor Response**:
> "I see TODO markers in your functions—that's good note-taking! Let's complete them. In `dollars_to_float()`, how do you remove the `$` from a string like `$10.50`?"

**Type**: correction → guidance

---

## Example 6: Print Instead of Return (Function Problem)

### Problem: Making Faces (Lecture 0)

**Student Code**:
```python
def convert(text):
    print(text.replace(":)", "🙂").replace(":(", "🙁"))

def main():
    text = input("Text: ")
    convert(text)

if __name__ == "__main__":
    main()
```

**Student Message**: "Works on my computer"

**Mentor Analysis**:
1. ✅ Has `def convert`
2. ✅ Has emoji replacements
3. ❌ Has `print()` instead of `return`
4. ✅ This IS a function problem (making_faces requires return)
5. ✅ Not empty
6. ✅ No TODO

**Mentor Response**:
> "Your function is printing the converted text, but the specification asks the function to **return** a value. What's the difference, and how should you modify the code? Hint: what happens if another function needs the result?"

**Type**: correction

---

## Example 7: Script Problem (NOT a Function Problem)

### Problem: Indoor Voice (Lecture 0)

**Student Code**:
```python
text = input("Say something: ").lower()
print(text)
```

**Student Message**: "Looks good?"

**Mentor Analysis**:
1. ✅ Has `input(`
2. ✅ Has `.lower(`
3. ✅ Has `print(` - **Expected for script problems!**
4. ✅ This is NOT a function problem (indoor_voice is script-based)
5. ✅ No return needed

**Mentor Response**:
> "✅ Perfect! Your solution correctly reads input, converts to lowercase, and prints the result."

**Type**: positive

**Note**: No print-vs-return hint even though there's a print. This is correct because script problems expect print!

---

## Example 8: Syntax Error - Missing Colon

### Problem: Deep Thought (Lecture 1)

**Student Code**:
```python
answer = input("What is the Answer? ").lower()
if answer == "42"  # Missing colon!
    print("Yes")
else:
    print("No")
```

**Student Message**: "Why isn't this working?"

**Mentor Analysis**:
1. ✅ Has `input(`
2. ✅ Has `.lower(`
3. ❌ Missing `:` after if statement
4. Line check detects: `if answer == "42"` without `:`

**Mentor Response**:
> "Python syntax requires a specific punctuation mark at the end of conditional statements. Look at your `if` line—do you have a colon (`:`) after the condition?"

**Type**: correction

---

## Example 9: Boolean Comparison Issue

### Problem: Home Federal Savings Bank (Lecture 1)

**Student Code**:
```python
greeting = input("Greeting: ").lower()
if greeting.startswith("hello") == True:
    print("$0")
elif greeting.startswith("h") == True:
    print("$20")
else:
    print("$100")
```

**Student Message**: "My logic works but looks verbose"

**Mentor Analysis**:
1. ✅ Has the right greeting checks
2. ✅ Has correct outputs
3. ❌ Uses `== True` comparison
4. detectsBooleanComparison: true

**Mentor Response**:
> "Your logic is correct! But do you need to explicitly compare against `True`? The `startswith()` method already returns `True` or `False`. What if you simplified to `if greeting.startswith("hello"):`?"

**Type**: correction (gentle)

---

## Example 10: Missing Required Mappings

### Problem: File Extensions (Lecture 1)

**Student Code**:
```python
filename = input("Filename: ").lower()
if filename.endswith(".jpg") or filename.endswith(".jpeg"):
    print("image/jpeg")
elif filename.endswith(".pdf"):
    print("application/pdf")
else:
    print("application/octet-stream")
```

**Student Message**: "Only did the common ones"

**Mentor Analysis**:
1. ✅ Has `endswith(` logic
2. ✅ Has some MIME types
3. ❌ Missing: gif, png, txt, zip
4. ❌ Missing types

**Mentor Response**:
> "Good start! You've covered jpg and pdf. But have you covered all the required file types? The specification mentions gif, png, txt, and zip. What are their MIME types?"

**Type**: guidance

---

## Example 11: Loop Missing

### Problem: Camel Case (Lecture 2)

**Student Code**:
```python
text = input("camelCase: ")
if text.isupper():
    print(text.lower())
else:
    print(text)
```

**Student Message**: "This should work"

**Mentor Analysis**:
1. ✅ Has `input(`
2. ✅ Has `.isupper(` for case checking
3. ❌ No `for` loop - checking whole string, not each character
4. Missing underscore insertion logic

**Mentor Response**:
> "You're checking character case correctly, but you're checking the whole string at once. The specification asks you to convert the string character by character. How can you go through each character individually? What loop structure would help?"

**Type**: guidance

---

## Example 12: Wrong Algorithm

### Problem: Coke Machine (Lecture 2)

**Student Code**:
```python
amount_due = 50
coins_inserted = int(input("Insert coin: "))
if coins_inserted == 25:
    amount_due -= 25
elif coins_inserted == 10:
    amount_due -= 10
elif coins_inserted == 5:
    amount_due -= 5

print(f"Change owed: {amount_due}")
```

**Student Message**: "Why doesn't this work?"

**Mentor Analysis**:
1. ✅ Has coin values (25, 10, 5)
2. ✅ Has subtraction logic
3. ❌ No `while` loop - asks once, doesn't repeat
4. No "Amount due" prompts before each coin

**Mentor Response**:
> "You're handling the coins correctly, but the machine should keep asking for coins until the full amount is paid. What loop structure lets you ask the user repeatedly until a condition is met?"

**Type**: guidance

---

## Example 13: Positive Feedback on Complex Problem

### Problem: Vanity Plates (Lecture 2)

**Student Code**:
```python
def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")

def is_valid(plate):
    if len(plate) < 2 or len(plate) > 6:
        return False
    
    if not plate[0].isalpha():
        return False
    
    if not plate[-1].isalpha():
        return False
    
    for char in plate:
        if not (char.isalpha() or char.isdigit()):
            return False
    
    return True

if __name__ == "__main__":
    main()
```

**Student Message**: "I think I got it all"

**Mentor Analysis**:
1. ✅ Has `def main()`
2. ✅ Has `def is_valid()`
3. ✅ Has `len()` checks
4. ✅ Has `.isalpha()` checks
5. ✅ Has `.isdigit()` checks
6. ✅ Returns properly (not prints)
7. ✅ Handles all requirements

**Mentor Response**:
> "✅ Excellent work! Your solution correctly validates vanity plate format with proper length checks and character validation. Your code is well-structured with separate functions—exactly what the specification asks for!"

**Type**: positive | **isCorrect**: true

---

## Example 14: Catch-All Fallback

### Problem: Unknown code pattern

**Student Code**:
```python
x = input()
y = x * 2
z = y + x
print(z)
```

**Student Message**: "Does this work?"

**Mentor Analysis**:
1. ✅ Has `input(`
2. ✅ Has operations
3. ✅ Has `print(`
4. ⚠️ No specific hint matches

**Mentor Response**:
> "What does your code do step by step? Walk me through the logic. What should happen when you run it with sample input? Does the output match what the specification asks for?"

**Type**: generic (fallback Socratic)

---

## Summary of Mentor Personality

**Tone**:
- ✅ Encouraging ("Great, you've...")
- ✅ Socratic ("What happens if...?")
- ✅ Specific ("The specification asks for...")
- ❌ Not punitive ("You got it wrong")
- ❌ Not vague ("Fix your code")

**Pattern**:
1. Acknowledge what they did right
2. Identify the gap (if any)
3. Ask a guiding question
4. Point to the specification

**Example**:
> ❌ Bad: "Your code is wrong. You need .lower()"
> ✅ Good: "What string method converts text to lowercase?"

**Escalation**:
- ✅ Simple mistake → Direct hint
- ✅ Complex issue → Socratic question
- ✅ Correct code → Positive reinforcement
- ✅ Stuck → Generic fallback

---

## How Mentor Helps Students Learn

### Scenario 1: Student Types Random Code
```
Student: "lol idk what to do"
Mentor: "How would you begin? What input does the specification require?"
→ Guides to re-read spec
```

### Scenario 2: Student Has One Missing Piece  
```
Student: "feedback?"
Mentor: "You've got the loop structure right. What string method lets you check if a character is uppercase?"
→ Targets the specific missing piece
```

### Scenario 3: Student Comments Their Way Out
```
Student: "I documented my algorithm"
Mentor: "I see ideas in comments. Let's translate those to Python code. How would you implement...?"
→ Guides from documentation to code
```

### Scenario 4: Student Gives Up
```
Student: "I don't know where to start"
Mentor: "Let's take it step by step. First, what does the problem ask you to read?"
→ Breaks problem into pieces
```

### Scenario 5: Student Nails It
```
Student: "Does this work?"
Mentor: "✅ Your solution looks solid! Great use of [technique]."
→ Positive reinforcement
```

---

## Mentor Response Time

**Perceived**: 600ms delay (feels human)

**Actual**:
- Code analysis: <5ms
- Hint selection: <1ms
- Chat history save: <10ms
- Total: ~16ms
- + 600ms artificial delay for UX

**Result**: Feels like a real tutor thinking about your code.

