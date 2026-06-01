# Lecture 3: Exceptions

## Overview
In this lecture, we learn how to handle errors gracefully. Exceptions are events that occur during program execution that can disrupt normal flow. We'll learn how to catch, handle, and raise exceptions.

## Key Concepts

### 1. What Are Exceptions?
An exception is an event that happens during program execution and breaks the normal flow.

```python
# This causes a ZeroDivisionError
result = 10 / 0
```

### 2. Common Exception Types

**ValueError** - When a value is of the wrong type:
```python
age = int("hello")  # ValueError: invalid literal for int()
```

**ZeroDivisionError** - When dividing by zero:
```python
result = 10 / 0  # ZeroDivisionError
```

**TypeError** - When an operation is applied to wrong type:
```python
"hello" + 5  # TypeError: can only concatenate str with str
```

**KeyError** - When accessing a non-existent dictionary key:
```python
person = {"name": "Alice"}
print(person["age"])  # KeyError: 'age'
```

**IndexError** - When accessing an invalid list index:
```python
items = [1, 2, 3]
print(items[5])  # IndexError: list index out of range
```

**FileNotFoundError** - When trying to open a non-existent file:
```python
with open("nonexistent.txt") as f:
    data = f.read()  # FileNotFoundError
```

### 3. Try-Except Blocks
Wrap code that might cause an exception in a try-except block.

```python
try:
    x = int(input("Enter a number: "))
    result = 10 / x
    print(result)
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("That's not a valid integer!")
```

### 4. Catching General Exceptions
Catch any exception with a bare `except` clause (not recommended, but sometimes necessary):

```python
try:
    value = int(input("Number: "))
except:
    print("Something went wrong")
```

### 5. The `else` Clause
Execute code if no exception occurred:

```python
try:
    x = int(input("Number: "))
except ValueError:
    print("Not a valid number")
else:
    print(f"You entered: {x}")
```

### 6. The `finally` Clause
Execute code regardless of whether an exception occurred:

```python
try:
    file = open("data.txt")
    data = file.read()
except FileNotFoundError:
    print("File not found!")
finally:
    if 'file' in locals():
        file.close()  # Always close the file
```

### 7. Raising Exceptions
Manually raise an exception when something is wrong:

```python
age = int(input("Age: "))

if age < 0:
    raise ValueError("Age cannot be negative!")

print(f"You are {age} years old")
```

### 8. Custom Exception Messages
Include a message when raising an exception:

```python
try:
    quantity = int(input("How many? "))
    if quantity > 100:
        raise ValueError("Quantity cannot exceed 100")
except ValueError as e:
    print(f"Error: {e}")
```

### 9. Exception Objects
Capture the exception object to get detailed information:

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Exception type: {type(e).__name__}")
    print(f"Exception message: {e}")
```

### 10. Validating User Input with Loops
Prompt repeatedly until valid input is received:

```python
while True:
    try:
        age = int(input("Age: "))
        if age < 0:
            raise ValueError("Age must be positive")
        break  # Input is valid, exit loop
    except ValueError as e:
        print(f"Invalid input: {e}. Please try again.")

print(f"You are {age} years old")
```

## Common Pitfalls

### ❌ Pitfall 1: Bare `except` Clause
```python
# WRONG: Catches everything including system exits
try:
    x = int(input("Number: "))
except:
    print("Error")
```

✅ **Correct:**
```python
try:
    x = int(input("Number: "))
except ValueError:
    print("Not a valid number")
```

### ❌ Pitfall 2: Not Re-prompting After Exception
```python
# WRONG: Only asks once
try:
    x = int(input("Number: "))
except ValueError:
    print("Try again")
```

✅ **Correct:**
```python
while True:
    try:
        x = int(input("Number: "))
        break
    except ValueError:
        print("Not a valid number. Try again.")
```

### ❌ Pitfall 3: Not Validating Values Within Range
```python
# WRONG: Only checks type, not range
try:
    score = int(input("Score: "))
except ValueError:
    print("Invalid number")
# What if score is -5 or 101?
```

✅ **Correct:**
```python
try:
    score = int(input("Score: "))
    if not (0 <= score <= 100):
        raise ValueError("Score must be between 0 and 100")
except ValueError as e:
    print(f"Invalid input: {e}")
```

### ❌ Pitfall 4: Catching Exception But Not Using It
```python
# WRONG: Exception is created but not needed
try:
    result = 10 / x
except ZeroDivisionError as e:
    print("Division by zero!")  # Not using 'e'
```

✅ **Correct:**
```python
try:
    result = 10 / x
except ZeroDivisionError as e:
    print(f"Error: {e}")
```

## Summary
- **Exceptions** disrupt normal program flow when errors occur
- **try-except** blocks catch and handle exceptions
- **else** clause runs if no exception occurred
- **finally** clause runs regardless of exceptions
- **raise** manually throws an exception
- **while True with break** pattern handles invalid input gracefully
- **Validate** both type and range of values

## Practice Problems
1. Write a program that divides two numbers with proper exception handling
2. Write a program that converts a temperature from Celsius to Fahrenheit, validating that the input is a valid number
3. Write a program that reads a CSV file and handles FileNotFoundError gracefully
