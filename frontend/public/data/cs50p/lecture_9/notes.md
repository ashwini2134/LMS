# Lecture 9: Type Hints

## Overview
In this final Python lecture, we cover advanced features: type hints, docstrings, argparse, unpacking, and functional programming utilities like map, filter, and zip.

## Key Concepts

### 1. Type Hints
Annotations that indicate expected types for function parameters and return values.

```python
def greet(name: str) -> str:
    return f\"Hello, {name}!\"

result: str = greet(\"Alice\")
```

**Common types:**
```python
def process(
    age: int,
    score: float,
    name: str,
    is_active: bool,
    items: list,
    mapping: dict
) -> None:
    pass
```

**Generic types:**
```python
from typing import List, Dict, Tuple, Optional, Union

def get_scores(names: List[str]) -> Dict[str, int]:
    return {name: 100 for name in names}

def get_coordinates() -> Tuple[int, int]:
    return (10, 20)

def find_user(user_id: int) -> Optional[str]:
    return \"Alice\" if user_id == 1 else None

def process_value(value: Union[int, str]) -> None:
    pass
```

### 2. Docstrings
Documentation for functions and classes.

```python
def add(a: int, b: int) -> int:
    \"\"\"
    Add two numbers together.

    Args:
        a: First number
        b: Second number

    Returns:
        The sum of a and b

    Raises:
        TypeError: If arguments are not numbers
    \"\"\"
    return a + b
```

**For classes:**
```python
class Student:
    \"\"\"
    Represents a student with name and GPA.

    Attributes:
        name (str): Student's name
        gpa (float): Student's GPA
    \"\"\"

    def __init__(self, name: str, gpa: float) -> None:
        \"\"\"Initialize a Student.\"\"\"
        self.name = name
        self.gpa = gpa
```

### 3. argparse Module
Parse command-line arguments.

```python
import argparse

parser = argparse.ArgumentParser(description=\"Process student data\")
parser.add_argument(\"name\", help=\"Student's name\")
parser.add_argument(\"--gpa\", type=float, default=3.0, help=\"Student's GPA\")
parser.add_argument(\"-v\", \"--verbose\", action=\"store_true\", help=\"Verbose output\")

args = parser.parse_args()

print(f\"Name: {args.name}\")
print(f\"GPA: {args.gpa}\")
if args.verbose:
    print(\"Verbose mode enabled\")
```

**Running:**
```bash
$ python program.py Alice --gpa 3.5 -v
Name: Alice
GPA: 3.5
Verbose mode enabled
```

### 4. Unpacking
Extract values from sequences.

**Basic unpacking:**
```python
a, b, c = [1, 2, 3]
print(a, b, c)  # 1 2 3
```

**Extended unpacking:**
```python
first, *middle, last = [1, 2, 3, 4, 5]
print(first)    # 1
print(middle)   # [2, 3, 4]
print(last)     # 5
```

**Unpacking in function calls:**
```python
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
result = add(*numbers)  # Unpacks the list
print(result)  # 6
```

**Dictionary unpacking:**
```python
def greet(name, greeting=\"Hello\"):
    print(f\"{greeting}, {name}!\")

params = {\"name\": \"Alice\", \"greeting\": \"Hi\"}
greet(**params)  # Unpacks dictionary
```

### 5. map()
Apply a function to each item in an iterable.

```python
numbers = [\"1\", \"2\", \"3\"]
int_numbers = list(map(int, numbers))
print(int_numbers)  # [1, 2, 3]

# With lambda
squared = list(map(lambda x: x ** 2, [1, 2, 3, 4]))
print(squared)  # [1, 4, 9, 16]
```

### 6. filter()
Keep only items that satisfy a condition.

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6]

# Filter non-None values
data = [1, None, 2, None, 3]
filtered = list(filter(None, data))
print(filtered)  # [1, 2, 3]
```

### 7. zip()
Combine multiple iterables.

```python
names = [\"Alice\", \"Bob\", \"Charlie\"]
ages = [20, 21, 22]

pairs = list(zip(names, ages))
print(pairs)
# [(\"Alice\", 20), (\"Bob\", 21), (\"Charlie\", 22)]

# Iterate over pairs
for name, age in zip(names, ages):
    print(f\"{name} is {age} years old\")
```

**Unzipping:**
```python
pairs = [(\"Alice\", 20), (\"Bob\", 21), (\"Charlie\", 22)]
names, ages = zip(*pairs)
print(names)  # (\"Alice\", \"Bob\", \"Charlie\")
print(ages)   # (20, 21, 22)
```

### 8. List Comprehensions (Alternative to map/filter)
More Pythonic way to create lists.

```python
# Equivalent to map()
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# Equivalent to filter()
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]

# Combining map and filter
data = [1, 2, 3, 4, 5]
result = [x ** 2 for x in data if x % 2 == 0]
print(result)  # [4, 16]
```

### 9. Lambda Functions
Anonymous functions for short operations.

```python
square = lambda x: x ** 2
print(square(5))  # 25

# Useful with map/filter
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]
```

### 10. Combining Advanced Features
```python
# Type hints, docstrings, and functional programming
from typing import List, Callable

def transform_numbers(
    numbers: List[int],
    transformer: Callable[[int], int]
) -> List[int]:
    \"\"\"
    Apply transformer function to numbers.

    Args:
        numbers: List of integers
        transformer: Function to apply to each number

    Returns:
        List of transformed numbers
    \"\"\"
    return list(map(transformer, numbers))

result = transform_numbers([1, 2, 3], lambda x: x ** 2)
print(result)  # [1, 4, 9]
```

## Common Pitfalls

### ❌ Pitfall 1: Type Hints Don't Enforce Types
```python
# Type hints are suggestions, not enforced
def add(a: int, b: int) -> int:
    return a + b

result = add(\"hello\", \"world\")  # No error! (bad code)
```

✅ **Use a type checker:**
```bash
pip install mypy
mypy program.py  # Catches type errors
```

### ❌ Pitfall 2: Forgetting to Convert map() to list
```python
# map() returns an iterator, not a list
result = map(int, [\"1\", \"2\", \"3\"])
print(result)  # <map object at 0x...>

# Need to convert
result = list(map(int, [\"1\", \"2\", \"3\"]))
print(result)  # [1, 2, 3]
```

### ❌ Pitfall 3: Overcomplicating with Lambdas
```python
# WRONG: Lambda is harder to read
result = list(filter(lambda x: x > 0 and x < 10, numbers))

# BETTER: Use list comprehension
result = [x for x in numbers if 0 < x < 10]
```

### ❌ Pitfall 4: Ignoring zip() Length Mismatch
```python
# zip() stops at shortest sequence
names = [\"Alice\", \"Bob\", \"Charlie\"]
ages = [20, 21]  # Only 2 ages!

pairs = list(zip(names, ages))
print(pairs)  # [(\"Alice\", 20), (\"Bob\", 21)] — Charlie is missing!
```

## Summary
- **Type hints** improve code clarity and enable type checking
- **Docstrings** document expected behavior
- **argparse** handles command-line arguments
- **Unpacking** extracts values with `*` and `**`
- **map()** applies functions to iterables
- **filter()** keeps matching items
- **zip()** combines iterables
- **List comprehensions** are often better than map/filter
- **Lambda functions** are useful for short operations

## Practice Problems
1. Write a program that uses argparse to accept multiple numbers and computes their average
2. Write a program that reads a CSV file, filters rows, and maps data using type hints
3. Create a Student class with type hints and comprehensive docstrings
