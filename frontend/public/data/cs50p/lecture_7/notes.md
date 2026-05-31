# Lecture 7: Regular Expressions

## Overview
In this lecture, we learn how to use regular expressions (regex) to search, match, and manipulate strings. Regular expressions are powerful patterns for text processing.

## Key Concepts

### 1. What Are Regular Expressions?
Patterns used to match and manipulate strings.

```python
import re

# Check if string matches pattern
if re.search(r"^[a-z]+@[a-z]+\\.[a-z]+$", "user@example.com"):
    print("Valid email")
```

### 2. Basic Matching

**`re.search(pattern, string)` - First match:**
```python
import re

text = "The year is 2024"
result = re.search(r"\\d{4}", text)  # Find 4 digits
if result:
    print(result.group())  # 2024
```

**`re.match(pattern, string)` - Match at beginning:**
```python
if re.match(r"^Hello", "Hello, World!"):
    print("Starts with Hello")
```

**`re.fullmatch(pattern, string)` - Match entire string:**
```python
if re.fullmatch(r"[0-9]{3}-[0-9]{3}-[0-9]{4}", "555-123-4567"):
    print("Valid phone format")
```

### 3. Character Classes

**`.` - Any character (except newline):**
```python
re.search(r"c.t", "cat")   # Matches
re.search(r"c.t", "cut")   # Matches
```

**`[abc]` - Any character in brackets:**
```python
re.search(r"[aeiou]", "hello")  # Matches vowel
```

**`[^abc]` - Any character NOT in brackets:**
```python
re.search(r"[^aeiou]", "hello")  # Matches consonant
```

**`[a-z]` - Range of characters:**
```python
re.search(r"[a-z]", "Hello")   # Matches lowercase
re.search(r"[0-9]", "abc123")  # Matches digit
re.search(r"[A-Z0-9]", "Test")  # Matches uppercase or digit
```

**Shorthand character classes:**
- `\\d` - Digit [0-9]
- `\\D` - Non-digit [^0-9]
- `\\w` - Word character [a-zA-Z0-9_]
- `\\W` - Non-word character
- `\\s` - Whitespace
- `\\S` - Non-whitespace

### 4. Quantifiers

**`*` - Zero or more:**
```python
re.search(r"ca*t", "cat")    # Matches
re.search(r"ca*t", "caat")   # Matches
re.search(r"ca*t", "ct")     # Matches
```

**`+` - One or more:**
```python
re.search(r"ca+t", "cat")    # Matches
re.search(r"ca+t", "caat")   # Matches
re.search(r"ca+t", "ct")     # Doesn't match
```

**`?` - Zero or one:**
```python
re.search(r"colou?r", "color")   # Matches
re.search(r"colou?r", "colour")  # Matches
```

**`{n}` - Exactly n times:**
```python
re.search(r"\\d{3}", "12345")    # Matches "123"
re.search(r"\\d{3}", "12")       # Doesn't match
```

**`{n,m}` - Between n and m times:**
```python
re.search(r"\\d{2,4}", "12345")  # Matches "1234"
```

### 5. Anchors

**`^` - Start of string:**
```python
re.match(r"^Hello", "Hello, World!")  # Matches
re.match(r"^World", "Hello, World!")  # Doesn't match
```

**`$` - End of string:**
```python
re.search(r"World!$", "Hello, World!")  # Matches
re.search(r"World$", "Hello, World!")   # Doesn't match
```

### 6. Groups and Capturing

**`()` - Capturing group:**
```python
result = re.search(r"([a-z]+)@([a-z]+)\\.([a-z]+)", "user@example.com")
print(result.group(0))  # user@example.com (entire match)
print(result.group(1))  # user
print(result.group(2))  # example
print(result.group(3))  # com
```

**`(?:)` - Non-capturing group:**
```python
re.search(r"(?:jpg|png|gif)", "image.png")  # Matches
```

### 7. Alternation

**`|` - OR:**
```python
re.search(r"cat|dog", "I have a dog")  # Matches
re.search(r"cat|dog", "I have a cat")  # Matches
```

### 8. Finding All Matches

**`re.findall()` - Find all matches:**
```python
emails = re.findall(r"\\b[a-z]+@[a-z]+\\.[a-z]+\\b", 
                    "Contact: alice@example.com or bob@test.com")
print(emails)  # ['alice@example.com', 'bob@test.com']
```

### 9. Replacing Text

**`re.sub()` - Replace matches:**
```python
text = "Hello 2024, goodbye 2023"
result = re.sub(r"\\d{4}", "YEAR", text)
print(result)  # Hello YEAR, goodbye YEAR
```

**Replace with function:**
```python
def uppercase_match(match):
    return match.group(0).upper()

text = "hello world"
result = re.sub(r"\\b\\w+\\b", uppercase_match, text)
print(result)  # HELLO WORLD
```

### 10. Splitting Text

**`re.split()` - Split by pattern:**
```python
text = "apple,banana;orange:grape"
fruits = re.split(r"[,;:]", text)
print(fruits)  # ['apple', 'banana', 'orange', 'grape']
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting Raw String Prefix
```python
# WRONG: Backslashes are interpreted as escape sequences
pattern = "\\d+"  # This is actually just "d+"

# CORRECT: Raw string prefix
pattern = r"\\d+"  # This is the digit regex
```

### ❌ Pitfall 2: Using `re.match()` Instead of `re.search()`
```python
# WRONG: re.match() only matches at the beginning
re.match(r"\\d+", "Hello 123")  # None

# CORRECT: re.search() finds anywhere in string
re.search(r"\\d+", "Hello 123")  # Matches "123"
```

### ❌ Pitfall 3: Forgetting to Escape Special Characters
```python
# WRONG: . matches any character
re.search(r"example.com", "exampleXcom")  # Matches!

# CORRECT: Escape the dot
re.search(r"example\\.com", "example.com")  # Matches
```

### ❌ Pitfall 4: Incorrect Anchors
```python
# WRONG: Will match "testing" (has "test" at start)
re.search(r"^test$", "testing")  # None

# CORRECT:
re.search(r"^test$", "test")  # Matches
```

## Summary
- **Patterns** match and manipulate text
- **Character classes** like `\\d` and `[a-z]` match specific types
- **Quantifiers** like `+`, `*`, `?` specify how many times to match
- **Anchors** like `^` and `$` mark positions
- **Groups** capture substrings with `()`
- **`re.search()`** finds first match
- **`re.findall()`** finds all matches
- **`re.sub()`** replaces matches
- **Always use raw strings** (r\"...\") for patterns

## Practice Problems
1. Write a regex to validate credit card numbers (16 digits, grouped by 4)
2. Write a program to extract all URLs from a text file
3. Write a program to validate IP addresses (xxx.xxx.xxx.xxx format)
