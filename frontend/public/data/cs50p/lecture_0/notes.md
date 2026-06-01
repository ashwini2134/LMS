# Lecture 0: Functions & Variables

## Overview
In this lecture, we introduce the fundamentals of Python programming: how to write and run code, use variables to store data, and leverage built-in functions to solve problems.

## Key Concepts

### 1. Your First Program: `print()`
The `print()` function displays text to the screen.

```python
print("Hello, World!")
```

Output:
```
Hello, World!
```

### 2. Variables
Variables store data that you can use and manipulate throughout your program.

```python
name = "Alice"
age = 20
print(name)
print(age)
```

Output:
```
Alice
20
```

**Variable Naming Rules:**
- Start with a letter or underscore
- Use lowercase with underscores for multiple words (snake_case)
- No spaces or special characters (except underscore)

### 3. Input and Conversion
Use `input()` to get user input. The result is always a **string**, even if the user enters numbers.

```python
name = input("What's your name? ")
print(f"Hello, {name}!")
```

**Converting Input to Numbers:**
```python
age_str = input("How old are you? ")
age = int(age_str)  # Convert string to integer
print(age + 1)
```

### 4. Comments
Comments explain your code. Python ignores them.

```python
# This is a comment
name = "Bob"  # This is also a comment
```

### 5. Arithmetic Operations
Python supports basic mathematical operations.

```python
x = 10
y = 3

print(x + y)  # Addition: 13
print(x - y)  # Subtraction: 7
print(x * y)  # Multiplication: 30
print(x / y)  # Division: 3.333...
print(x // y) # Floor division: 3
print(x % y)  # Modulo (remainder): 1
print(x ** y) # Exponentiation: 1000
```

### 6. String Formatting
There are multiple ways to combine strings and variables.

**Method 1: Concatenation with `+`**
```python
first_name = "John"
last_name = "Doe"
print("Hello, " + first_name + " " + last_name)
```

**Method 2: F-strings (Recommended)**
```python
first_name = "John"
last_name = "Doe"
print(f"Hello, {first_name} {last_name}")
```

**Method 3: `format()` method**
```python
print("Hello, {} {}".format("John", "Doe"))
```

### 7. Data Types
Python has several built-in data types:

```python
# Integers (whole numbers)
count = 5

# Floats (decimals)
price = 19.99

# Strings (text)
message = "Hello"

# Booleans (True/False)
is_student = True

# Check a variable's type
print(type(count))      # <class 'int'>
print(type(price))      # <class 'float'>
print(type(message))    # <class 'str'>
print(type(is_student)) # <class 'bool'>
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting Type Conversion
```python
# WRONG: This will crash if user enters a number
age = input("How old are you? ")
print(age + 1)  # Error: can't add string and int
```

✅ **Correct:**
```python
age = int(input("How old are you? "))
print(age + 1)
```

### ❌ Pitfall 2: String Concatenation Type Mismatch
```python
# WRONG: Can't concatenate string and number
print("I am " + 20 + " years old")
```

✅ **Correct:**
```python
print("I am " + str(20) + " years old")
# OR
print(f"I am {20} years old")
```

### ❌ Pitfall 3: Operator Priority
Remember that `**` (exponentiation) has higher precedence than `*` and `/`.

```python
# WRONG: This calculates as (5 * 3) ** 2 = 225
result = 5 * 3 ** 2

# Correct calculation: 5 * (3 ** 2) = 5 * 9 = 45
result = 5 * (3 ** 2)
```

### ❌ Pitfall 4: Using Wrong Arithmetic Operator
```python
# WRONG: ^ is bitwise XOR, not exponentiation
2 ^ 3  # Results in 1, not 8

# CORRECT: Use **
2 ** 3  # Results in 8
```

## Summary

- **`print()`** displays output
- **Variables** store data with meaningful names
- **`input()`** gets user data (always returns a string)
- **Type conversion** (`int()`, `float()`, `str()`) changes data types
- **Arithmetic operators** perform calculations
- **F-strings** are the modern way to format output
- **Comments** document your code

## Practice Problems
1. Write a program that converts Celsius to Fahrenheit: F = (C × 9/5) + 32
2. Write a program that calculates the area of a rectangle (length × width)
3. Write a program that determines if a number is even or odd (hint: use modulo `%`)

