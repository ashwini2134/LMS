# Lecture 6: File I/O

## Overview
In this lecture, we learn how to read from and write to files. File I/O (Input/Output) is essential for working with persistent data.

## Key Concepts

### 1. Opening and Reading Files
Use the `open()` function to access files.

**Read entire file:**
```python
with open("data.txt") as f:
    data = f.read()
    print(data)
```

**Read line by line:**
```python
with open("data.txt") as f:
    for line in f:
        print(line.rstrip())  # rstrip() removes trailing newline
```

**Read all lines into list:**
```python
with open("data.txt") as f:
    lines = f.readlines()  # Includes newline characters
    for line in lines:
        print(line.rstrip())
```

### 2. The `with` Statement
The `with` statement automatically closes files.

```python
# Good practice - file is closed automatically
with open("data.txt") as f:
    data = f.read()

# Manual closing (not recommended)
f = open("data.txt")
data = f.read()
f.close()  # Must remember to close
```

### 3. Writing to Files

**Write string:**
```python
with open("output.txt", "w") as f:
    f.write("Hello, World!\n")
    f.write("Second line\n")
```

**Append to file:**
```python
with open("output.txt", "a") as f:
    f.write("Appended line\n")
```

**Modes:**
- `"r"` - Read (default)
- `"w"` - Write (overwrites existing file)
- `"a"` - Append (adds to end of file)
- `"x"` - Create (fails if file exists)

### 4. Working with CSV Files

**Read CSV:**
```python
import csv

with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])
```

**Write CSV:**
```python
import csv

students = [
    {"name": "Alice", "age": 20},
    {"name": "Bob", "age": 21},
]

with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(students)
```

### 5. Working with JSON Files

**Read JSON:**
```python
import json

with open("data.json") as f:
    data = json.load(f)
    print(data["name"])
```

**Write JSON:**
```python
import json

data = {
    "name": "Alice",
    "age": 20,
    "courses": ["CS50", "Python"]
}

with open("output.json", "w") as f:
    json.dump(data, f, indent=2)
```

### 6. Path Handling

**Using pathlib (Modern approach):**
```python
from pathlib import Path

# Create path object
file_path = Path("data") / "file.txt"

# Check if exists
if file_path.exists():
    print("File exists")

# Get absolute path
print(file_path.absolute())

# Read file
content = file_path.read_text()
```

**Using os (Older approach):**
```python
import os

# Join paths
path = os.path.join("data", "file.txt")

# Check if exists
if os.path.exists(path):
    print("File exists")
```

### 7. File Operations

**Get file size:**
```python
import os

size = os.path.getsize("file.txt")  # Bytes
```

**List directory contents:**
```python
import os

files = os.listdir(".")
for file in files:
    print(file)
```

**Create directories:**
```python
import os

os.makedirs("new/nested/folder", exist_ok=True)
```

### 8. Handling File Errors

**File not found:**
```python
try:
    with open("nonexistent.txt") as f:
        data = f.read()
except FileNotFoundError:
    print("File not found!")
```

**Permission denied:**
```python
try:
    with open("protected.txt", "w") as f:
        f.write("data")
except PermissionError:
    print("No permission to write!")
```

### 9. Processing Large Files
Don't load entire file into memory for large files.

```python
# Good: Processes line by line
with open("large_file.txt") as f:
    for line in f:
        process(line.rstrip())

# Bad: Loads entire file
with open("large_file.txt") as f:
    data = f.read()  # May be too large for memory
```

### 10. Command-Line Arguments for Files
Accept filename from user via command line.

```python
import sys

if len(sys.argv) != 2:
    print("Usage: python program.py filename")
    sys.exit(1)

filename = sys.argv[1]

try:
    with open(filename) as f:
        data = f.read()
except FileNotFoundError:
    print(f"Could not find {filename}")
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting `newline=""` with CSV
```python
# WRONG: CSV may have blank lines on Windows
with open("data.csv", "w") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
```

✅ **Correct:**
```python
with open("data.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
```

### ❌ Pitfall 2: Not Using `with` Statement
```python
# WRONG: File may not be closed if exception occurs
f = open("data.txt")
data = f.read()
f.close()
```

✅ **Correct:**
```python
with open("data.txt") as f:
    data = f.read()  # File automatically closed
```

### ❌ Pitfall 3: Writing Strings When Bytes Expected
```python
# WRONG: Binary mode expects bytes
with open("data.bin", "wb") as f:
    f.write("text")  # TypeError
```

✅ **Correct:**
```python
with open("data.bin", "wb") as f:
    f.write(b"text")  # Bytes
```

### ❌ Pitfall 4: Not Handling Newlines
```python
# WRONG: Keeps newline characters
with open("data.txt") as f:
    for line in f:
        print(line)  # Extra blank line because of \n
```

✅ **Correct:**
```python
with open("data.txt") as f:
    for line in f:
        print(line.rstrip())  # Remove trailing whitespace
```

### ❌ Pitfall 5: Overwriting Data Unintentionally
```python
# WRONG: "w" mode overwrites entire file
with open("data.txt", "w") as f:
    f.write("new data")  # Old data is lost!
```

✅ **Correct:**
```python
with open("data.txt", "a") as f:
    f.write("new data")  # Appends to end
```

## Summary
- **`with` statement** automatically closes files
- **`open()` modes:** r (read), w (write), a (append)
- **CSV** files use csv module
- **JSON** files use json module
- **File paths** can use Path or os modules
- **Large files** should be processed line-by-line
- **Always handle** FileNotFoundError and PermissionError

## Practice Problems
1. Write a program that reads a text file and outputs statistics (word count, line count, character count)
2. Write a program that reads a CSV and outputs summary statistics
3. Write a program that monitors a file and prints new lines as they're added
