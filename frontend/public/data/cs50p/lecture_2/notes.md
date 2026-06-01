# Lecture 2: Loops

## Overview
In this lecture, we learn how to repeat code using loops. We explore two types of loops in Python: `while` loops (repeat while a condition is true) and `for` loops (repeat over a sequence).

## Key Concepts

### 1. The `while` Loop
Repeat a block of code as long as a condition is true.

```python
i = 0
while i < 3:
    print(f"i is {i}")
    i += 1
```

Output:
```
i is 0
i is 1
i is 2
```

### 2. Infinite Loops
A loop that never ends because the condition is always true.

```python
# WRONG: This will run forever!
while True:
    print("Help, I'm stuck!")
```

✅ **To exit:** Press Ctrl+C to stop the program.

### 3. The `break` Statement
Exit a loop immediately.

```python
while True:
    user_input = input("Type 'quit' to exit: ")
    if user_input == "quit":
        break
    print(f"You said: {user_input}")

print("Goodbye!")
```

### 4. The `continue` Statement
Skip the current iteration and go to the next one.

```python
for i in range(5):
    if i == 2:
        continue  # Skip when i is 2
    print(i)
```

Output:
```
0
1
3
4
```

### 5. The `for` Loop
Repeat a block of code for each item in a sequence.

```python
for name in ["Alice", "Bob", "Charlie"]:
    print(f"Hello, {name}")
```

Output:
```
Hello, Alice
Hello, Bob
Hello, Charlie
```

### 6. The `range()` Function
Generate a sequence of numbers.

```python
# range(stop): 0 to stop-1
for i in range(3):
    print(i)
```

Output:
```
0
1
2
```

**With start and stop:**
```python
# range(start, stop): start to stop-1
for i in range(2, 5):
    print(i)
```

Output:
```
2
3
4
```

**With step:**
```python
# range(start, stop, step): count by step
for i in range(0, 10, 2):
    print(i)
```

Output:
```
0
2
4
6
8
```

### 7. Iterating Through Strings
You can loop over characters in a string.

```python
for char in "Python":
    print(char)
```

Output:
```
P
y
t
h
o
n
```

### 8. Nested Loops
Loops inside loops.

```python
for i in range(3):
    for j in range(2):
        print(f"i={i}, j={j}")
```

Output:
```
i=0, j=0
i=0, j=1
i=1, j=0
i=1, j=1
i=2, j=0
i=2, j=1
```

### 9. Accumulator Pattern
Use a variable to accumulate a result across loop iterations.

```python
total = 0
for i in range(1, 6):
    total += i
print(f"Sum: {total}")  # 15
```

### 10. String Building with Loops
Build a string by concatenating in a loop.

```python
result = ""
for char in "hello":
    if char != 'l':
        result += char
print(result)  # "heo"
```

## Common Pitfalls

### ❌ Pitfall 1: Off-by-One Errors with `range()`
```python
# WRONG: Tries to print 0-10, but stops at 9
for i in range(10):
    print(i)  # Prints 0-9, not 0-10
```

✅ **Correct:**
```python
for i in range(11):  # Use 11 to get 0-10
    print(i)
```

### ❌ Pitfall 2: Modifying a List While Looping Over It
```python
# WRONG: Can skip elements or cause errors
items = [1, 2, 3, 4, 5]
for item in items:
    if item % 2 == 0:
        items.remove(item)  # Don't do this!
```

✅ **Correct:**
```python
items = [1, 2, 3, 4, 5]
filtered = [item for item in items if item % 2 != 0]
```

### ❌ Pitfall 3: Using `while` When `for` is Better
```python
# Awkward with while
i = 0
while i < len(items):
    print(items[i])
    i += 1
```

✅ **Better with for:**
```python
for item in items:
    print(item)
```

### ❌ Pitfall 4: Infinite Loop from Forgotten Increment
```python
# WRONG: i is never incremented
i = 0
while i < 10:
    print(i)
    # Forgot to do i += 1 — infinite loop!
```

✅ **Correct:**
```python
i = 0
while i < 10:
    print(i)
    i += 1
```

## Summary
- **`while` loops** repeat while a condition is true
- **`for` loops** repeat for each item in a sequence
- **`range(stop)`** generates numbers from 0 to stop-1
- **`break`** exits a loop early
- **`continue`** skips to the next iteration
- **Accumulator pattern** builds a result across iterations
- **String concatenation in loops** can build complex strings

## Practice Problems
1. Write a program that prints the multiplication table for a number 1-10
2. Write a program that counts down from 10 to 1 and then prints "Blastoff!"
3. Write a program that finds the sum of all even numbers from 1 to 100
