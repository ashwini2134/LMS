# Lecture 1: Conditionals

## Overview
In this lecture, we learn how to make our programs make decisions using conditional statements. We explore comparison operators, logical operators, and how to structure if/elif/else blocks.

## Key Concepts

### 1. Comparison Operators
These operators compare two values and return True or False.

```python
x = 10
y = 20

print(x == y)  # Equal: False
print(x != y)  # Not equal: True
print(x < y)   # Less than: True
print(x > y)   # Greater than: False
print(x <= y)  # Less than or equal: True
print(x >= y)  # Greater than or equal: False
```

### 2. The `if` Statement
Execute a block of code only if a condition is true.

```python
age = 18

if age >= 18:
    print("You are an adult")
```

Output:
```
You are an adult
```

### 3. The `if/else` Statement
Execute one block if a condition is true, otherwise execute another block.

```python
age = 15

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
```

Output:
```
You are a minor
```

### 4. The `if/elif/else` Statement
Handle multiple conditions with `elif` (else if).

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")
```

Output:
```
Your grade is: B
```

### 5. Logical Operators
Combine multiple conditions using `and`, `or`, and `not`.

**`and` operator** (both conditions must be true):
```python
age = 25
income = 50000

if age >= 18 and income > 30000:
    print("You qualify for the loan")
```

**`or` operator** (at least one condition must be true):
```python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")
```

**`not` operator** (reverses the boolean):
```python
is_raining = False

if not is_raining:
    print("Let's go outside!")
```

### 6. String Methods for Conditionals

**`.lower()` and `.upper()`:**
```python
greeting = input("What's your greeting? ")

if greeting.lower().startswith("hello"):
    print("Hello to you!")
```

**`.startswith()` and `.endswith()`:**
```python
filename = input("File name: ")

if filename.endswith(".pdf"):
    print("PDF file detected")
```

**`.isdigit()`, `.isalpha()`, `.isalnum()`:**
```python
text = "123"

if text.isdigit():
    print("This is all numbers")

if text.isalpha():
    print("This is all letters")

if text.isalnum():
    print("This is letters and/or numbers")
```

### 7. Boolean Variables
A variable that stores True or False.

```python
is_student = True
has_license = False

if is_student and not has_license:
    print("You need a license to drive")
```

### 8. Truthiness
In Python, certain values are considered "truthy" or "falsy" in a boolean context.

**Falsy values:**
- `None`
- `False`
- `0`, `0.0`
- Empty string: `""`
- Empty list: `[]`
- Empty dict: `{}`

**Truthy values:**
- `True`
- Non-zero numbers: `1`, `-5`, `3.14`
- Non-empty strings: `"hello"`
- Non-empty lists: `[1, 2, 3]`

```python
name = input("What's your name? ")

if name:  # Checks if name is not empty
    print(f"Hello, {name}")
else:
    print("You didn't enter a name")
```

## Common Pitfalls

### ❌ Pitfall 1: Using `=` Instead of `==`
```python
# WRONG: This assigns 18 to age, doesn't compare
if age = 18:
    print("You are 18")

# Syntax Error: can't assign in condition
```

✅ **Correct:**
```python
if age == 18:
    print("You are 18")
```

### ❌ Pitfall 2: Forgetting `elif` and Using Multiple `if` Statements
```python
# WRONG: All conditions are checked (inefficient)
score = 95

if score >= 90:
    grade = "A"
if score >= 80:
    grade = "B"
if score >= 70:
    grade = "C"

print(grade)  # Prints "A" (but checks all conditions)
```

✅ **Correct:**
```python
score = 95

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"

print(grade)  # Prints "A" (stops after first match)
```

### ❌ Pitfall 3: Case Sensitivity Issues
```python
# WRONG: "Hello" != "hello" in Python
greeting = input("Say hello: ")

if greeting == "hello":
    print("You said hello!")
# If user types "Hello", this won't work
```

✅ **Correct:**
```python
greeting = input("Say hello: ")

if greeting.lower() == "hello":
    print("You said hello!")
```

### ❌ Pitfall 4: Incorrect String Methods with Conditionals
```python
# WRONG: startswith() returns True/False, doesn't modify
filename = "document.pdf"

if filename.lower() == ".pdf":  # Always False
    print("This is a PDF")
```

✅ **Correct:**
```python
filename = "document.pdf"

if filename.lower().endswith(".pdf"):
    print("This is a PDF")
```

### ❌ Pitfall 5: Forgetting Parentheses with `and`/`or`
```python
# WRONG: Due to operator precedence, this is confusing
if x > 5 and y > 10 or z > 20:
    # Is this (x > 5 and y > 10) or (z > 20)?
    # Or is it x > 5 and (y > 10 or z > 20)?

# Use explicit parentheses:
if (x > 5 and y > 10) or (z > 20):
    pass
```

## Summary
- **Comparison operators** (`==`, `!=`, `<`, `>`, `<=`, `>=`) compare values
- **Logical operators** (`and`, `or`, `not`) combine conditions
- **`if/elif/else`** structures handle multiple branching paths
- **String methods** like `.lower()` and `.startswith()` are useful for conditionals
- **Always use `==` for comparison, not `=` for assignment**
- **Use `elif` instead of multiple `if` statements for efficiency**

## Practice Problems
1. Write a program that determines if a number is positive, negative, or zero
2. Write a program that checks if a year is a leap year (divisible by 4, except centuries unless divisible by 400)
3. Write a program that outputs the absolute value of a number without using `abs()`

